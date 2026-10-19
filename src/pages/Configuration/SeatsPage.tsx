import {
  ArrowLeft,
  BarChart3,
  Building2,
  MapPin,
  Plus,
  Check,
  CheckCircle2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { ROUTES } from "../../constants/routes";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";
import ClearFiltersButton from "../../components/common/ClearFiltersButton";
import type { District } from "../../types";

export default function SeatsPage() {
  const navigate = useNavigate();
  const { provinces, districts, setDistricts } = useAppContext();
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [allocationProvinceId, setAllocationProvinceId] = useState("");
  const [allocationDistrictId, setAllocationDistrictId] = useState("");
  const [seatCount, setSeatCount] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const allocationDistricts = useMemo(
    () =>
      districts.filter((d) => String(d.provinceId) === allocationProvinceId),
    [districts, allocationProvinceId],
  );
  const filteredDistricts = useMemo(
    () =>
      districts
        .filter(
          (d) =>
            provinceFilter === "all" || String(d.provinceId) === provinceFilter,
        )
        .filter(
          (d) => districtFilter === "all" || String(d.id) === districtFilter,
        )
        .sort(
          (a, b) =>
            Number((b.status || "active").toLowerCase() === "active") -
            Number((a.status || "active").toLowerCase() === "active"),
        ),
    [districts, provinceFilter, districtFilter],
  );
  const {
    pageItems: visibleDistricts,
    pagination,
    resetPage,
  } = usePagination(filteredDistricts);
  const update = (id, value) => {
    // TODO: Validate the seat count, save it through the backend, then handle loading and errors.
  };
  const changeStatus = (district: District, status: string) => {
    // TODO: Update the district status through the backend API and apply its response.
  };
  const openAllocation = () => {
    setAllocationProvinceId("");
    setAllocationDistrictId("");
    setSeatCount("");
    setSaveError("");
    setSaved(false);
    setModalOpen(true);
  };
  const totalSeats = districts.reduce(
    (sum, d) => sum + (Number(d.seats) || 0),
    0,
  );
  const configuredCount = districts.filter((d) => Number(d.seats) > 0).length;
  return (
    <div>
      <PageHeader
        title="Seat Allocation"
        description="Set the number of seats available in each district."
        action={
          <div className="configuration-page-actions">
            <button
              className="button secondary configuration-back"
              onClick={() => navigate(ROUTES.CONFIGURATION)}
            >
              <ArrowLeft size={16} /> Back to Configuration
            </button>
            <Button icon={Plus} onClick={openAllocation}>
              Add Seat Allocation
            </Button>
          </div>
        }
      />
      <div className="module-summary-grid">
        <div className="module-summary-card">
          <span className="module-summary-icon blue">
            <BarChart3 size={19} />
          </span>
          <div>
            <small>Total seats</small>
            <strong>{totalSeats}</strong>
          </div>
        </div>
        <div className="module-summary-card">
          <span className="module-summary-icon green">
            <CheckCircle2 size={19} />
          </span>
          <div>
            <small>Districts configured</small>
            <strong>
              {configuredCount} <small>/ {districts.length}</small>
            </strong>
          </div>
        </div>
        <div className="module-summary-card">
          <span className="module-summary-icon amber">
            <BarChart3 size={19} />
          </span>
          <div>
            <small>Needs allocation</small>
            <strong>{districts.length - configuredCount}</strong>
          </div>
        </div>
      </div>
      <section className="module-panel">
        <div className="module-panel-heading seat-filter-heading">
          <div>
            <h3>District seat allocation</h3>
            <p>Choose a province, then narrow the table to a district.</p>
          </div>
          <div className="seat-filter-group">
            <label className="election-district-filter">
              <MapPin size={16} />
              <span className="sr-only">Filter by province</span>
              <select
                value={provinceFilter}
                aria-label="Filter by province"
                onChange={(e) => {
                  setProvinceFilter(e.target.value);
                  setDistrictFilter("all");
                  resetPage();
                }}
              >
                <option value="all">All provinces</option>
              </select>
            </label>
            <label className="election-district-filter">
              <Building2 size={16} />
              <span className="sr-only">Filter by district</span>
              <select
                value={districtFilter}
                aria-label="Filter by district"
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  resetPage();
                }}
              >
                <option value="all">All districts</option>
              </select>
            </label>
            <ClearFiltersButton
              onClick={() => {
                setProvinceFilter("all");
                setDistrictFilter("all");
                resetPage();
              }}
            />
          </div>
        </div>
        <div className="table-scroll">
          <table className="data-table module-table">
            <thead>
              <tr>
                <th>District</th>
                <th>Province</th>
                <th>Number of seats</th>
                <th>District status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" className="module-empty">
                  Connect the district API to render seat allocation rows here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination
          {...(pagination || {
            page: 1,
            pageCount: 1,
            total: filteredDistricts.length,
            pageSize: 10,
            setPage: () => {},
          })}
        />
        {saved && (
          <div className="module-panel-footer">
            <span className="inline-success">
              <CheckCircle2 size={15} /> Seat allocation saved.
            </span>
          </div>
        )}
      </section>
      {modalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) =>
            e.target === e.currentTarget && !saving && setModalOpen(false)
          }
        >
          <section
            className="crud-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seat-allocation-title"
          >
            <div className="crud-modal-heading">
              <div>
                <span className="crud-modal-icon">
                  <BarChart3 size={19} />
                </span>
                <div>
                  <h3 id="seat-allocation-title">Add seat allocation</h3>
                  <p>
                    Select a province and district, then enter its seat count.
                  </p>
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                update(allocationDistrictId, seatCount);
              }}
            >
              <label className="modal-field">
                Province
                <select
                  className="input"
                  value={allocationProvinceId}
                  onChange={(e) => {
                    setAllocationProvinceId(e.target.value);
                    setAllocationDistrictId("");
                  }}
                  required
                >
                  <option value="">Select a province</option>
                </select>
              </label>
              <label className="modal-field">
                District
                <select
                  className="input"
                  value={allocationDistrictId}
                  onChange={(e) => setAllocationDistrictId(e.target.value)}
                  disabled={!allocationProvinceId}
                  required
                >
                  <option value="">
                    {!allocationProvinceId
                      ? "Select a province first"
                      : "Select a district"}
                  </option>
                </select>
              </label>
              <p className="seat-allocation-empty-hint">
                Connect the province and district APIs to populate these
                selectors.
              </p>
              <label className="modal-field">
                Number of seats
                <input
                  className="input"
                  type="number"
                  min="1"
                  step="1"
                  value={seatCount}
                  onChange={(e) => setSeatCount(e.target.value)}
                  placeholder="Enter seat count"
                  required
                />
              </label>
              {saveError && (
                <div className="error-box seat-allocation-error">
                  {saveError}
                </div>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  icon={Check}
                  disabled={saving || !allocationDistrictId}
                >
                  {saving ? "Saving…" : "Save allocation"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
