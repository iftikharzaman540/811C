import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateActiveChat(userId: string) {
    let ticket = await this.prisma.ticket.findFirst({
      where: { user_id: userId, status: { in: ['OPEN', 'IN_PROGRESS'] } },
      orderBy: { created_at: 'desc' },
      include: { messages: { orderBy: { created_at: 'asc' } } }
    });

    if (!ticket) {
      ticket = await this.prisma.ticket.create({
        data: {
          user_id: userId,
          subject: 'Live Chat',
          category: 'OTHER',
          status: 'OPEN',
        },
        include: { messages: true }
      });
    }
    return ticket;
  }

  async sendMessage(userId: string, message: string, attachment?: string) {
    const ticket = await this.getOrCreateActiveChat(userId);
    
    
    const msg = await this.prisma.ticketMessage.create({
      data: {
        ticket_id: ticket.id,
        user_id: userId,
        message,
        attachment
      }
    });

    // Check if this is the very first message from the user
    const msgCount = await this.prisma.ticketMessage.count({
      where: { ticket_id: ticket.id }
    });

    if (msgCount === 1) {
      setTimeout(async () => {
        try {
          await this.prisma.ticketMessage.create({
            data: {
              ticket_id: ticket.id,
              admin_id: 'system_bot',
              message: "Thank you for reaching out to 8111C Official Support. An agent will be with you shortly. Please hold on..."
            }
          });
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }

    return { success: true, message: msg };

  }

  async getChatHistory(userId: string) {
    return this.getOrCreateActiveChat(userId);
  }
}
