import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { normalizePhone } from './utils/normalize-phone';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // CREATE SINGLE MEMBER
  // ============================================================

  async create(dto: CreateMemberDto) {
    const mobileNumber = normalizePhone(dto.mobileNumber);

    if (!mobileNumber) {
      throw new BadRequestException(
        'Invalid mobile number.',
      );
    }

    const exists = await this.prisma.member.findFirst({
      where: {
        groupId: dto.groupId,
        mobileNumber,
      },
    });

    if (exists) {
      throw new ConflictException(
        'Member already exists in this group.',
      );
    }

    return this.prisma.member.create({
      data: {
        ...dto,
        mobileNumber,
      },
    });
  }

  // ============================================================
  // FIND ALL
  // ============================================================

  async findAll() {
    return this.prisma.member.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ============================================================
  // BULK UPLOAD
  // ============================================================

  async bulkUpload(
    file: Express.Multer.File,
    groupId: string,
  ) {
    // ------------------------------------------------------------
    // Validate file
    // ------------------------------------------------------------

    if (!file) {
      throw new BadRequestException(
        'CSV or Excel file is required.',
      );
    }

    // ------------------------------------------------------------
    // Validate groupId
    // ------------------------------------------------------------

    if (!groupId) {
      throw new BadRequestException(
        'groupId is required.',
      );
    }

    // ------------------------------------------------------------
    // Make sure group exists
    // ------------------------------------------------------------

    const group = await this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new NotFoundException(
        'Group not found.',
      );
    }

    // ------------------------------------------------------------
    // Parse uploaded file
    // ------------------------------------------------------------

    let rows: any[] = [];

    try {
      const originalName =
        file.originalname?.toLowerCase() || '';

      const extension =
        originalName.split('.').pop();

      // ----------------------------------------------------------
      // CSV
      // ----------------------------------------------------------

      if (extension === 'csv') {
        rows = parse(
          file.buffer.toString('utf-8'),
          {
            columns: true,
            skip_empty_lines: true,
            trim: true,
          },
        );
      }

      // ----------------------------------------------------------
      // Excel
      // ----------------------------------------------------------

      else if (
        extension === 'xlsx' ||
        extension === 'xls'
      ) {
        const workbook = XLSX.read(
          file.buffer,
          {
            type: 'buffer',
          },
        );

        const firstSheetName =
          workbook.SheetNames[0];

        if (!firstSheetName) {
          throw new BadRequestException(
            'Excel file contains no worksheets.',
          );
        }

        const worksheet =
          workbook.Sheets[firstSheetName];

        rows = XLSX.utils.sheet_to_json(
          worksheet,
          {
            defval: '',
          },
        );
      }

      // ----------------------------------------------------------
      // Unsupported file
      // ----------------------------------------------------------

      else {
        throw new BadRequestException(
          'Unsupported file type. Please upload CSV, XLSX, or XLS.',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Unable to read the uploaded file.',
      );
    }

    // ------------------------------------------------------------
    // Empty file
    // ------------------------------------------------------------

    if (!rows.length) {
      throw new BadRequestException(
        'The uploaded file contains no members.',
      );
    }

    // ------------------------------------------------------------
    // Validate required columns
    // ------------------------------------------------------------

    const requiredColumns = [
      'mobileNumber',
    ];

    const availableColumns =
      Object.keys(rows[0]);

    for (const column of requiredColumns) {
      if (!availableColumns.includes(column)) {
        throw new BadRequestException(
          `Missing required column: ${column}`,
        );
      }
    }

    // ------------------------------------------------------------
    // Prepare validation
    // ------------------------------------------------------------

    const errors: any[] = [];
    const validMembers: any[] = [];

    const uploadedPhones =
      new Set<string>();

    // Keeps the original file row for each phone number
    const rowByPhone =
      new Map<string, number>();

    // ------------------------------------------------------------
    // Validate every uploaded row
    // ------------------------------------------------------------

    for (
      const [index, row] of rows.entries()
    ) {
      // Header is row 1
      // First member is row 2
      const rowNumber = index + 2;

      // ----------------------------------------------------------
      // Mobile number required
      // ----------------------------------------------------------

      const rawMobileNumber =
        String(
          row.mobileNumber ?? '',
        ).trim();

      if (!rawMobileNumber) {
        errors.push({
          row: rowNumber,
          mobileNumber: '',
          error:
            'Mobile number is required.',
        });

        continue;
      }

      // ----------------------------------------------------------
      // Normalize phone number
      // ----------------------------------------------------------

      const mobileNumber =
        normalizePhone(
          rawMobileNumber,
        );

      if (!mobileNumber) {
        errors.push({
          row: rowNumber,
          mobileNumber:
            rawMobileNumber,
          error:
            'Invalid mobile number.',
        });

        continue;
      }

      // Store original row number
      rowByPhone.set(
        mobileNumber,
        rowNumber,
      );

      // ----------------------------------------------------------
      // Duplicate inside uploaded file
      // ----------------------------------------------------------

      if (
        uploadedPhones.has(
          mobileNumber,
        )
      ) {
        errors.push({
          row: rowNumber,
          mobileNumber,
          error:
            'Duplicate mobile number in file.',
        });

        continue;
      }

      uploadedPhones.add(
        mobileNumber,
      );

      // ----------------------------------------------------------
      // Validate default contribution
      // ----------------------------------------------------------

      let defaultContribution:
        number | null = null;

      const rawContribution =
        row.defaultContribution;

      if (
        rawContribution !== undefined &&
        rawContribution !== null &&
        rawContribution !== ''
      ) {
        const amount =
          Number(rawContribution);

        if (
          Number.isNaN(amount)
        ) {
          errors.push({
            row: rowNumber,
            mobileNumber,
            error:
              'Invalid default contribution.',
          });

          continue;
        }

        defaultContribution =
          amount;
      }

      // ----------------------------------------------------------
      // Prepare valid member
      // ----------------------------------------------------------

      validMembers.push({
        firstName:
          String(
            row.firstName ?? '',
          ).trim() || null,

        lastName:
          String(
            row.lastName ?? '',
          ).trim() || null,

        mobileNumber,

        email:
          String(
            row.email ?? '',
          ).trim() || null,

        comment:
          String(
            row.comment ?? '',
          ).trim() || null,

        defaultContribution,

        groupId,
      });
    }

    // ------------------------------------------------------------
    // If nothing valid remains
    // ------------------------------------------------------------

    if (!validMembers.length) {
      return {
        success: false,
        totalRows: rows.length,
        imported: 0,
        failed: errors.length,
        errors,
      };
    }

    // ------------------------------------------------------------
    // Find existing members in this group
    // ------------------------------------------------------------

    const existingMembers =
      await this.prisma.member.findMany({
        where: {
          groupId,
          mobileNumber: {
            in: validMembers.map(
              member =>
                member.mobileNumber,
            ),
          },
        },

        select: {
          mobileNumber: true,
        },
      });

    const existingPhones =
      new Set(
        existingMembers.map(
          member =>
            member.mobileNumber,
        ),
      );

    // ------------------------------------------------------------
    // Remove existing members
    // ------------------------------------------------------------

    const membersToCreate =
      validMembers.filter(
        member => {
          if (
            existingPhones.has(
              member.mobileNumber,
            )
          ) {
            errors.push({
              row:
                rowByPhone.get(
                  member.mobileNumber,
                ) ?? null,

              mobileNumber:
                member.mobileNumber,

              error:
                'Member already exists in this group.',
            });

            return false;
          }

          return true;
        },
      );

    // ------------------------------------------------------------
    // Insert valid members
    // ------------------------------------------------------------

    let insertedMembers:
      { mobileNumber: string }[] =
      [];

    if (
      membersToCreate.length
    ) {
      insertedMembers =
        await this.prisma.member.createManyAndReturn(
          {
            data:
              membersToCreate,

            skipDuplicates: true,

            select: {
              mobileNumber: true,
            },
          },
        );
    }

    // ------------------------------------------------------------
    // Determine which members were actually inserted
    // ------------------------------------------------------------

    const insertedPhones =
      new Set(
        insertedMembers.map(
          member =>
            member.mobileNumber,
        ),
      );

    // ------------------------------------------------------------
    // Detect records skipped by database duplicate protection
    // ------------------------------------------------------------

    for (
      const member of membersToCreate
    ) {
      if (
        !insertedPhones.has(
          member.mobileNumber,
        )
      ) {
        errors.push({
          row:
            rowByPhone.get(
              member.mobileNumber,
            ) ?? null,

          mobileNumber:
            member.mobileNumber,

          error:
            'Member could not be inserted because a duplicate exists in the database.',
        });
      }
    }

    // ------------------------------------------------------------
    // Final result
    // ------------------------------------------------------------

    return {
      success:
        errors.length === 0,

      totalRows:
        rows.length,

      imported:
        insertedMembers.length,

      failed:
        errors.length,

      errors,
    };
  }

  // ============================================================
  // FIND ONE
  // ============================================================

  async findOne(id: string) {
    const member =
      await this.prisma.member.findUnique({
        where: {
          id,
        },
      });

    if (!member) {
      throw new NotFoundException(
        'Member not found.',
      );
    }

    return member;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  async update(
    id: string,
    dto: UpdateMemberDto,
  ) {
    const currentMember =
      await this.findOne(id);

    let mobileNumber =
      dto.mobileNumber;

    if (dto.mobileNumber) {
      mobileNumber =
        normalizePhone(
          dto.mobileNumber,
        );

      if (!mobileNumber) {
        throw new BadRequestException(
          'Invalid mobile number.',
        );
      }

      const existing =
        await this.prisma.member.findFirst({
          where: {
            groupId:
              currentMember.groupId,

            mobileNumber,

            NOT: {
              id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Mobile number already exists in this group.',
        );
      }
    }

    return this.prisma.member.update({
      where: {
        id,
      },

      data: {
        ...dto,

        ...(mobileNumber
          ? {
              mobileNumber,
            }
          : {}),
      },
    });
  }

  // ============================================================
  // DELETE
  // ============================================================

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.member.delete({
      where: {
        id,
      },
    });
  }
}