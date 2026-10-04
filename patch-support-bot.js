const fs = require('fs');
let code = fs.readFileSync('backend/src/support/support.service.ts', 'utf8');

const replacement = `
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
`;

code = code.replace(/const msg = await this\.prisma\.ticketMessage\.create\(\{[\s\S]*?\}\);\s*return \{ success: true, message: msg \};/, replacement);

fs.writeFileSync('backend/src/support/support.service.ts', code);
console.log("Added auto-reply bot");
