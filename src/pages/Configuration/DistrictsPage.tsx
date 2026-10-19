import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Search,
  SquarePen,
  Trash2,
  X,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { ROUTES } from "../../constants/routes";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";
import ClearFiltersButton from "../../components/common/ClearFiltersButton";
import type { District } from "../../types";

export default function DistrictsPage() {
  const navigate = useNavigate();
  const { provinces, districts, setDistricts } = useAppContext();
  const [provinceId, setProvinceId] = useState("");
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [editing, setEditing] = useState<District | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredDistricts = useMemo(
    () =>
      districts.filter(
        (d) =>
          (provinceFilter === "all" ||
            String(d.provinceId) === provinceFilter) &&
          `${d.name} ${d.provinceName}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [districts, query, provinceFilter],
  );
  const {
    pageItems: visibleDistricts,
    pagination,
    resetPage,
  } = usePagination(filteredDistricts);
  const openCreate = () => {
    setEditing(null);
    setName("");
    setProvinceId("");
    setDialogOpen(true);
  };
  const openEdit = (district: District) => {
    setEditing(district);
    setName(district.name);
    setProvinceId(String(district.provinceId));
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setName("");
    setProvinceId("");
  };

  const save = () => {
    // TODO: Send the create/update request and use the backend response to update the UI.
  };
  const remove = (id: number) => {
    // TODO: Delete this district through the backend API, then refresh shared state.
  };
  const changeStatus = (district: District, status: string) => {
    // TODO: Update the district status through the backend API and apply its response.
  };

  return (
    <div>
      <PageHeader
        title="District Management"
        description="Organize districts under their provinces."
        action={
          <div className="configuration-page-actions">
            <button
              className="button secondary configuration-back"
              onClick={() => navigate(ROUTES.CONFIGURATION)}
            >
              <ArrowLeft size={16} /> Back to Configuration
            </button>
            <Button onClick={openCreate}>
              Add District
            </Button>
          </div>
        }
      />
      <div className="module-summary-grid">
        <div className="module-summary-card">
          <span className="module-summary-icon blue">
            <Building2 size={19} />
          </span>
          <div>
            <small>Total districts</small>
            <strong>{districts.length}</strong>
          </div>
        </div>
        <div className="module-summary-card">
          <span className="module-summary-icon green">
            <Building2 size={19} />
          </span>
          <div>
            <small>With seats assigned</small>
            <strong>
              {districts.filter((d) => Number(d.seats) > 0).length}
            </strong>
          </div>
        </div>
        <div className="module-summary-card">
          <span className="module-summary-icon violet">
            <Building2 size={19} />
          </span>
          <div>
            <small>Provinces covered</small>
            <strong>
              {new Set(districts.map((d) => d.provinceId)).size}{" "}
              <small>/ {provinces.length}</small>
            </strong>
          </div>
        </div>
      </div>
      <section className="module-panel">
        <div className="module-panel-heading">
          <div>
            <h3>All districts</h3>
            <p>
              Review district coverage and keep province assignments up to date.
            </p>
          </div>
          <div className="filter-actions">
            <label className="election-district-filter">
              <MapPin size={16} />
              <span className="sr-only">Filter by province</span>
              <select
                value={provinceFilter}
                aria-label="Filter by province"
                onChange={(e) => {
                  setProvinceFilter(e.target.value);
                  resetPage();
                }}
              >
                <option value="all">All provinces</option>
              </select>
            </label>
            <label className="module-search">
              <Search size={16} />
              <input
                aria-label="Search districts"
                placeholder="Search districts"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPage();
                }}
              />
            </label>
            <ClearFiltersButton
              onClick={() => {
                setProvinceFilter("all");
                setQuery("");
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
                <th>Seats</th>
                <th>Status</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="module-empty">
                  Connect the district API to render district rows here.
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
      </section>
      {dialogOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && closeDialog()}
        >
          <section
            className="crud-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="district-dialog-title"
          >
            <div className="crud-modal-heading">
              <div>
                <span className="crud-modal-icon">
                  <Building2 size={19} />
                </span>
                <div>
                  <h3 id="district-dialog-title">
                    {editing ? "Edit district" : "Add district"}
                  </h3>
                  <p>
                    {editing
                      ? "Update the district details below."
                      : "Add a district to a province."}
                  </p>
                </div>
              </div>
              <button
                className="modal-close"
                onClick={closeDialog}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <label className="modal-field">
                Province
                <select
                  className="input"
                  value={provinceId}
                  onChange={(e) => setProvinceId(e.target.value)}
                  required
                >
                  <option value="">Select a province</option>
                </select>
              </label>
              <label className="modal-field">
                District name
                <input
                  autoFocus
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. North District"
                  required
                  maxLength={80}
                />
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={closeDialog}
                >
                  Cancel
                </button>
                <Button type="submit" disabled={!provinceId}>
                  Save
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
