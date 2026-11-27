import { TicketsProvider } from '../../context/TicketsContext.jsx';
import CreateTicketForm from './CreateTicketForm.jsx';

export default function CreateTicketConProvider() {
  return (
    <TicketsProvider>
      <CreateTicketForm />
    </TicketsProvider>
  );
}
