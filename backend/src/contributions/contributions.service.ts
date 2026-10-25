import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import {
  ContributionStatus,
  PaymentProvider,
} from '@prisma/client';

import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

import { PrismaService } from '../prisma/prisma.service';
import { normalizePhone } from '../members/utils/normalize-phone';

import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';


@Injectable()
export class ContributionsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  // CREATE SINGLE CONTRIBUTION

  async create(dto: CreateContributionDto) {

    const campaign = await this.prisma.campaign.findUnique({
      where: {
        id: dto.campaignId,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    // TransactionReference must equal the campaign code.

    const campaignByCode = await this.prisma.campaign.findFirst({
      where: {
        groupId: campaign.groupId,
        code: dto.transactionReference,
      },
    });

    if (!campaignByCode) {
      throw new NotFoundException(
        `Campaign code "${dto.transactionReference}" does not exist in this group.`,
      );
    }

    if (campaignByCode.id !== campaign.id) {
      throw new BadRequestException(
        `Campaign code "${dto.transactionReference}" does not belong to the selected campaign.`,
      );
    }

    const member = await this.prisma.member.findFirst({
      where: {
        groupId: campaign.groupId,
        mobileNumber: dto.mobileNumber,
      },
    });

    if (!member) {
      throw new NotFoundException(
        'Member not found in this group',
      );
    }


    return this.prisma.$transaction(async (tx) => {

      const contribution =
        await tx.contribution.create({

          data: {
            amount: dto.amount,
            currency: campaign.currency ?? "TZS",
            mobileNumber: dto.mobileNumber,
            provider: dto.provider,
            providerReference: dto.providerReference,
            transactionReference:
              dto.transactionReference,
            campaignId: dto.campaignId,
            memberId: member.id,

            status: ContributionStatus.PENDING,
          },
        });

      return contribution;

    });

  }

  async findAll() {

    return this.prisma.contribution.findMany({

      include: {
        campaign: true,
        member: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

    });

  }

  async findOne(id: string) {

    const contribution =
      await this.prisma.contribution.findUnique({
        where: { id },
        include: {
          campaign: true,
          member: true,
        },
      });

    if (!contribution) {
      throw new NotFoundException(
        'Contribution not found',
      );
    }
    return contribution;
  }

  async findByCampaign(campaignId: string) {
    return this.prisma.contribution.findMany({
      where: {
        campaignId,
      },

      include: {
        member: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    dto: UpdateContributionDto,
  ) {
    await this.findOne(id);
    return this.prisma.contribution.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contribution.delete({
      where: {
        id,
      },
    });
  }

  // ============================================================
  // BULK CONTRIBUTION UPLOAD
  // ============================================================

  async bulkUpload(
    file: Express.Multer.File,
    groupId: string,
  ) {

    if (!file) {

      throw new BadRequestException(
        'Contribution file is required.',
      );

    }


    if (!groupId) {

      throw new BadRequestException(
        'groupId is required.',
      );

    }


    // ----------------------------------------------------------
    // 1. Verify group
    // ----------------------------------------------------------

    const group =
      await this.prisma.group.findUnique({
        where: {
          id: groupId,
        },
      });


    if (!group) {

      throw new NotFoundException(
        'Group not found.',
      );

    }


    // ----------------------------------------------------------
    // 2. Read CSV / XLS / XLSX
    // ----------------------------------------------------------

    const fileName =
      file.originalname.toLowerCase();


    let rows: any[] = [];


    try {

      if (fileName.endsWith('.csv')) {

        rows = parse(
          file.buffer.toString('utf-8'),
          {
            columns: true,
            skip_empty_lines: true,
            trim: true,
          },
        );

      }

      else if (
        fileName.endsWith('.xlsx') ||
        fileName.endsWith('.xls')
      ) {

        const workbook =
          XLSX.read(
            file.buffer,
            {
              type: 'buffer',
            },
          );


        const firstSheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];


        rows =
          XLSX.utils.sheet_to_json(
            firstSheet,
            {
              defval: '',
              raw: false,
            },
          );

      }

      else {

        throw new BadRequestException(
          'Only CSV, XLS and XLSX files are supported.',
        );

      }

    }

    catch (error) {

      if (
        error instanceof
        BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Could not read contribution file.',
      );

    }


    if (!rows.length) {

      throw new BadRequestException(
        'Contribution file contains no rows.',
      );

    }


    // ----------------------------------------------------------
    // 3. Process rows
    // ----------------------------------------------------------

    const errors: any[] = [];

    const validRows: any[] = [];


    for (
      let index = 0;
      index < rows.length;
      index++
    ) {

      const row = rows[index];

      const rowNumber =
        index + 2;


      try {

        // ------------------------------------------------------
        // FIRST NAME
        // ------------------------------------------------------

        const firstName =
          String(
            row.firstName ?? '',
          ).trim();


        // ------------------------------------------------------
        // LAST NAME
        // ------------------------------------------------------

        const lastName =
          String(
            row.lastName ?? '',
          ).trim();


        // ------------------------------------------------------
        // MOBILE
        // ------------------------------------------------------

        const rawMobile =
          String(
            row.mobileNumber ?? '',
          ).trim();


        if (!rawMobile) {

          throw new Error(
            'Mobile number is required.',
          );

        }


        const mobileNumber =
          normalizePhone(
            rawMobile,
          );


        if (!mobileNumber) {

          throw new Error(
            'Invalid mobile number.',
          );

        }


        // ------------------------------------------------------
        // AMOUNT
        // ------------------------------------------------------

        const rawAmount =
          String(
            row.amount ?? '',
          )
            .replace(/,/g, '')
            .trim();


        if (!rawAmount) {

          throw new Error(
            'Amount is required.',
          );

        }


        const amount =
          Number(rawAmount);


        if (
          !Number.isFinite(amount) ||
          amount <= 0
        ) {

          throw new Error(
            'Amount must be greater than zero.',
          );

        }


        // ------------------------------------------------------
        // TRANSACTION REFERENCE / CAMPAIGN CODE
        // ------------------------------------------------------

        const transactionReference =
          String(
            row.transactionReference ?? '',
          ).trim();


        if (!transactionReference) {

          throw new Error(
            'Transaction reference / campaign code is required.',
          );

        }


        // ------------------------------------------------------
        // PROVIDER
        // ------------------------------------------------------

        const rawProvider =
          String(
            row.provider ?? '',
          )
            .trim()
            .toUpperCase();


        if (!rawProvider) {

          throw new Error(
            'Payment provider is required.',
          );

        }


        if (
          !Object.values(
            PaymentProvider,
          ).includes(
            rawProvider as PaymentProvider,
          )
        ) {

          throw new Error(
            `Invalid payment provider "${rawProvider}".`,
          );

        }


        const provider =
          rawProvider as PaymentProvider;


        // ------------------------------------------------------
        // PROVIDER REFERENCE
        // ------------------------------------------------------

        const providerReference =
          String(
            row.providerReference ?? '',
          ).trim() || undefined;


        // ------------------------------------------------------
        // CAMPAIGN ID
        // ------------------------------------------------------

        const suppliedCampaignId =
          String(
            row.campaignId ?? '',
          ).trim() || undefined;


        // ------------------------------------------------------
        // FIND CAMPAIGN USING CODE
        //
        // IMPORTANT:
        //
        // transactionReference = campaign.code
        //
        // campaignId from file does NOT determine campaign.
        // ------------------------------------------------------

        const campaign =
          await this.prisma.campaign.findFirst({
            where: {
              groupId,
              code: transactionReference,
            },
          });


        if (!campaign) {

          throw new Error(
            `Campaign code "${transactionReference}" does not exist in this group.`,
          );

        }


        // ------------------------------------------------------
        // OPTIONAL CAMPAIGN ID CROSS-CHECK
        // ------------------------------------------------------

        if (
          suppliedCampaignId &&
          suppliedCampaignId !== campaign.id
        ) {

          throw new Error(
            `Campaign ID does not match campaign code "${transactionReference}".`,
          );

        }


        // ------------------------------------------------------
        // STORE VALIDATED ROW
        // ------------------------------------------------------

        validRows.push({

          rowNumber,

          firstName:
            firstName || null,

          lastName:
            lastName || null,

          mobileNumber,

          amount,

          transactionReference,

          provider,

          providerReference,

          campaignId:
            campaign.id,

          campaignCurrency:
            campaign.currency ??
            group.currency ??
            'TZS',

        });

      }

      catch (error) {

        errors.push({

          row:
            rowNumber,

          mobileNumber:
            row.mobileNumber ||
            '',

          transactionReference:
            row.transactionReference ||
            '',

          error:
            error.message ||
            'Invalid row.',

        });

      }

    }


    // ----------------------------------------------------------
    // 4. Import valid rows
    // ----------------------------------------------------------

    let imported = 0;

    let membersCreated = 0;


    for (
      const row of validRows
    ) {

      try {

        await this.prisma.$transaction(
          async (tx) => {

            // --------------------------------------------------
            // Find member
            // --------------------------------------------------

            let member =
              await tx.member.findFirst({
                where: {
                  groupId,
                  mobileNumber:
                    row.mobileNumber,
                },
              });


            // --------------------------------------------------
            // Create member if necessary
            // --------------------------------------------------

            if (!member) {

              member =
                await tx.member.create({

                  data: {

                    firstName:
                      row.firstName,

                    lastName:
                      row.lastName,

                    mobileNumber:
                      row.mobileNumber,

                    groupId,

                    status:
                      'ACTIVE',

                  },

                });


              membersCreated++;

            }


            // --------------------------------------------------
            // Create contribution
            //
            // NO DUPLICATE CHECK
            // --------------------------------------------------

            await tx.contribution.create({

              data: {

                amount:
                  row.amount,

                mobileNumber:
                  row.mobileNumber,

                provider:
                  row.provider,

                transactionReference:
                  row.transactionReference,

                providerReference:
                  row.providerReference,

                campaignId:
                  row.campaignId,

                memberId:
                  member.id,

                currency:
                  row.campaignCurrency,

                status:
                  ContributionStatus.SUCCESSFUL,

              },

            });


            imported++;

          },
        );

      }

      catch (error) {

        errors.push({

          row:
            row.rowNumber,
          mobileNumber:
            row.mobileNumber,
          transactionReference:
            row.transactionReference,
          error:
            error.message ||
            'Could not import contribution.',

        });
      }
    }


    // ----------------------------------------------------------
    // 5. Return import report
    // ----------------------------------------------------------

    return {
      success: true,
      totalRows:
        rows.length,
      imported,
      failed:
        errors.length,
      membersCreated,
      errors,
    };

  }

}