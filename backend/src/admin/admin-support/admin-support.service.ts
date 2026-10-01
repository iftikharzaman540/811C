import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminSupportService {
  constructor(private prisma: PrismaService) {}

  async getTickets(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.ticket.findMany({ 
        skip, 
        take: limit, 
        orderBy: { updated_at: 'desc' }, 
        include: { user: { select: { email: true, username: true } } } 
      }),
      this.prisma.ticket.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getTicket(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, username: true, id: true } },
        messages: { orderBy: { created_at: 'asc' } }
      }
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async replyToTicket(id: string, adminId: string, message: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const reply = await this.prisma.ticketMessage.create({
      data: {
        ticket_id: id,
        admin_id: adminId,
        message: message,
      }
    });

    // Automatically mark ticket as 'IN_PROGRESS' or similar if it was 'OPEN'
    // Let's just update the updated_at timestamp
    await this.prisma.ticket.update({
      where: { id },
      data: { updated_at: new Date() }
    });

    return reply;
  }

  async updateTicketStatus(id: string, status: string) {
    return this.prisma.ticket.update({
      where: { id },
      data: { status: status as any }
    });
  }
}