import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Clock3, History, MapPinned, Vote, Award } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { ROUTES } from "../../constants/routes";
import { formatNumber } from "../../utils/formatters";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";

export default function ResultLogPage() {
  const navigate = useNavigate();
  const { resultsLog, setLastResult } = useAppContext();
  const { pageItems, pagination } = usePagination(resultsLog);

  const openResult = result => {
    // TODO: Load the selected result from the backend and navigate to its result view.
  };

  return <div>
    <PageHeader title="Result Log" description="Review past election calculations and reopen a saved result." />
    <div className="stats-grid result-log-stats">
      <div className="stat-card"><div className="stat-icon"><History size={19}/></div><div><span>Calculations logged</span><strong>{resultsLog.length}</strong></div></div>
      <div className="stat-card"><div className="stat-icon"><MapPinned size={19}/></div><div><span>Districts calculated</span><strong>{new Set(resultsLog.map(result=>result.district)).size}</strong></div></div>
      <div className="stat-card"><div className="stat-icon"><Clock3 size={19}/></div><div><span>Latest calculation</span><strong className="result-log-latest">{resultsLog[0] ? new Date(resultsLog[0].calculatedAt).toLocaleDateString() : "—"}</strong></div></div>
      <div className="stat-card"><div className="stat-icon"><Award size={19}/></div><div><span>Seats in latest run</span><strong>{resultsLog[0]?.seats ?? 0}</strong></div></div>
    </div>

    <Card>
      <div className="card-title"><h3>Calculation history</h3><p>Each successful calculation is saved in this browser for later review.</p></div>
      {resultsLog.length ? <>
        <DataTable columns={["Calculated","District","Valid votes","Parties","Seats","Action"]}>
          <tr><td colSpan={6} className="module-empty">Connect the result history API to render history rows here.</td></tr>
        </DataTable>
        <Pagination {...(pagination || {page:1,pageCount:1,total:resultsLog.length,pageSize:10,setPage:()=>{}})} />
      </> : <div className="empty result-log-empty"><Vote size={38}/><h3>No calculations logged</h3><p>Run an election calculation to create the first result log entry.</p><Button onClick={()=>navigate(ROUTES.ELECTION)}>Go to Vote Entry</Button></div>}
    </Card>
  </div>;
}
