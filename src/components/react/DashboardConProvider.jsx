import { TicketsProvider } from '../../context/TicketsContext.jsx';
import DashboardOverview from './DashboardOverview.jsx';

export default function DashboardConProvider() {
  return (
    <TicketsProvider>
      <DashboardOverview />
    </TicketsProvider>
  );
}
