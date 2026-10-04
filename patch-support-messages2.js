const fs = require('fs');
let code = fs.readFileSync('backend/src/support/support.service.ts', 'utf8');

const replacement = `
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

    return { success: true, message: msg };
  }
`;

// Replace from `async sendMessage(` up to `return { success: true, message: msg };\n\n  }`
code = code.replace(/async sendMessage\([\s\S]*?return \{ success: true, message: msg \};\s*\}/, replacement.trim());

fs.writeFileSync('backend/src/support/support.service.ts', code);
console.log("Replaced sendMessage method successfully!");
