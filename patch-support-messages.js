const fs = require('fs');
let code = fs.readFileSync('backend/src/support/support.service.ts', 'utf8');

const replacement = `
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
      // First message ever -> send the sequence
      setTimeout(async () => {
        try {
          await this.prisma.ticketMessage.create({
            data: {
              ticket_id: ticket.id,
              admin_id: 'system_bot',
              message: "Please wait 3 to 4 mintues... \\nhumara numianda aap say jald raabta ker lay ga shukria.."
            }
          });
        } catch(e){}
      }, 3500);

      setTimeout(async () => {
        try {
          await this.prisma.ticketMessage.create({
            data: {
              ticket_id: ticket.id,
              admin_id: 'system_bot',
              message: "Mohtaram customer, Assalam-o-Alaikum! ?? Aapka message humein mil gaya hai. Filhal customer service dusre customers ki queries handle kar rahi hai. Meherbani karke thora sabr karein, hum jald hi aapko reply karenge. Aapki samajh aur support ka shukriya! ??"
            }
          });
        } catch(e){}
      }, 6000);
    } else {
      // Subsequent messages -> just the Urdu message
      setTimeout(async () => {
        try {
          await this.prisma.ticketMessage.create({
            data: {
              ticket_id: ticket.id,
              admin_id: 'system_bot',
              message: "Mohtaram customer, Assalam-o-Alaikum! ?? Aapka message humein mil gaya hai. Filhal customer service dusre customers ki queries handle kar rahi hai. Meherbani karke thora sabr karein, hum jald hi aapko reply karenge. Aapki samajh aur support ka shukriya! ??"
            }
          });
        } catch(e){}
      }, 2000);
    }

    return { success: true, message: msg };
`;

// Need to safely replace the old auto reply bot logic
const searchRegex = /const msg = await this\.prisma\.ticketMessage\.create\(\{[\s\S]*?\}\);\s*const msgCount = await this\.prisma\.ticketMessage\.count\(\{[\s\S]*?\}\);\s*if \(msgCount === 1\) \{[\s\S]*?\}\s*return \{ success: true, message: msg \};/;

if (searchRegex.test(code)) {
    code = code.replace(searchRegex, replacement);
    fs.writeFileSync('backend/src/support/support.service.ts', code);
    console.log("Updated auto-reply bot with the specific user messages");
} else {
    console.log("Could not find the block to replace.");
}
