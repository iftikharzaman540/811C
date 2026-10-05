const fs = require('fs');
const path = 'src/app/admin/support/tickets/[id]/page.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'import Link from \'next/link\';',
  'import Link from \'next/link\';\nimport { useParams } from \'next/navigation\';'
);

code = code.replace(
  'export default function TicketDetailsPage({ params }: { params: { id: string } }) {',
  'export default function TicketDetailsPage() {\n  const params = useParams();'
);

fs.writeFileSync(path, code);
