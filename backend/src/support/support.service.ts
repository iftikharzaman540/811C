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
    
    const msgCount = await this.prisma.ticketMessage.count({
      where: { ticket_id: ticket.id }
    });
    
    const msg = await this.prisma.ticketMessage.create({
      data: {
        ticket_id: ticket.id,
        user_id: userId,
        message,
        attachment
      }
    });

    // Update ticket's updated_at so it bumps to the top of the admin panel
    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { updated_at: new Date() }
    });

    if (msgCount === 0) {
      setTimeout(async () => {
        try {
          await this.prisma.ticketMessage.create({
            data: { ticket_id: ticket.id, admin_id: 'system_bot', message: "Please wait 3 to 4 mintues... \nhumara numianda aap say jald raabta ker lay ga shukria.." }
          });
        } catch(e){}
      }, 3500);

      setTimeout(async () => {
        try {
          await this.prisma.ticketMessage.create({
            data: { ticket_id: ticket.id, admin_id: 'system_bot', message: "Mohtaram customer, Assalam-o-Alaikum! ?? Aapka message humein mil gaya hai. Filhal customer service dusre customers ki queries handle kar rahi hai. Meherbani karke thora sabr karein, hum jald hi aapko reply karenge. Aapki samajh aur support ka shukriya! ??" }
          });
        } catch(e){}
      }, 6000);
    }

    return { success: true, message: msg };
  }

  async getChatHistory(userId: string) {
    return this.getOrCreateActiveChat(userId);
  }
}
