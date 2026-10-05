const fs = require('fs');
let code = fs.readFileSync('backend/src/support/support.service.ts', 'utf8');

const target = `    const msg = await this.prisma.ticketMessage.create({
      data: {
        ticket_id: ticket.id,
        user_id: userId,
        message,
        attachment
      }
    });

    if (msgCount === 0) {
      setTimeout(async () => {
        try {
          await this.prisma.ticketMessage.create({
            data: { ticket_id: ticket.id, admin_id: 'system_bot', message: "Please wait 3 to 4 mintues... \\nhumara numianda aap say jald raabta ker lay ga shukria.." }
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
    } else {
      setTimeout(async () => {
        try {
          await this.prisma.ticketMessage.create({
            data: { ticket_id: ticket.id, admin_id: 'system_bot', message: "Mohtaram customer, Assalam-o-Alaikum! ?? Aapka message humein mil gaya hai. Filhal customer service dusre customers ki queries handle kar rahi hai. Meherbani karke thora sabr karein, hum jald hi aapko reply karenge. Aapki samajh aur support ka shukriya! ??" }
          });
        } catch(e){}
      }, 2000);
    }

    return { success: true, message: msg };`;

const replacement = `    const msg = await this.prisma.ticketMessage.create({
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
            data: { ticket_id: ticket.id, admin_id: 'system_bot', message: "Please wait 3 to 4 mintues... \\nhumara numianda aap say jald raabta ker lay ga shukria.." }
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

    return { success: true, message: msg };`;

code = code.replace(target, replacement);
fs.writeFileSync('backend/src/support/support.service.ts', code);
