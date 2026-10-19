import { useAppContext } from "../../context/AppContext";
import { usePagination } from "../../hooks/usePagination";
import { formatNumber } from "../../utils/formatters";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/common/DataTable";
import { Vote, Calculator, Users, Award } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import type { ResultLogEntry } from "../../types";

export default function ResultsPage() {
  const { lastResult } = useAppContext();
  return <ResultsContent lastResult={lastResult} />;
}

function ResultsContent({ lastResult }: { lastResult: ResultLogEntry | null }) {
  const parties = lastResult?.parties ?? [];
  const { pagination } = usePagination(parties);

  return (
    <div>
      <PageHeader
        title={lastResult ? `${lastResult.district} — Final Election Results` : "Election Results"}
        description="Round 1, Round 2 and bonus seat allocation."
      />
      <div className="stats-grid">
        <StatCard title="Valid Votes" value={lastResult ? formatNumber(lastResult.validVotes) : "—"} icon={Vote} />
        <StatCard title="Threshold" value={lastResult ? formatNumber(lastResult.threshold) : "—"} icon={Calculator} />
        <StatCard title="Parties" value={lastResult ? parties.length : "—"} icon={Users} />
        <StatCard title="Total Seats" value={lastResult ? lastResult.seats : "—"} icon={Award} />
      </div>
      <Card>
        <div className="card-title">
          <h3>Seat Allocation</h3>
          <p>Final seats are the sum of Round 1, Round 2 and the bonus seat.</p>
        </div>
        <DataTable columns={["#", "Party", "Votes", "Qualification", "Round 1", "Round 2", "Bonus", "Total Seats"]}>
          <tr>
            <td colSpan={8} className="module-empty">
              {lastResult
                ? "Connect the election calculation API to render result rows here."
                : "No election result available. Connect the election calculation API to display results here."}
            </td>
          </tr>
        </DataTable>
        <Pagination
          {...(pagination || {
            page: 1,
            pageCount: 1,
            total: parties.length,
            pageSize: 10,
            setPage: () => {},
          })}
        />
      </Card>
    </div>
  );
}
