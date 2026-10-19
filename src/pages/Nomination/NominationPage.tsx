import { useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  Plus,
  Search,
  SquarePen,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";
import ClearFiltersButton from "../../components/common/ClearFiltersButton";
import type { Party } from "../../types";

export default function NominationPage() {
  const { provinces, districts, parties, setParties } = useAppContext();
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [name, setName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [partyQuery, setPartyQuery] = useState("");
  const list = useMemo(
    () =>
      districtId
        ? parties[districtId] || []
        : Object.entries(parties).flatMap(([id, parties]) =>
            parties.map((party) => ({
              ...party,
              districtId: party.districtId ?? Number(id),
            })),
          ),
    [parties, districtId],
  );
  const filteredParties = useMemo(
    () =>
      list.filter((p) => {
        const partyDistrict = districts.find(
          (d) => d.id === Number(p.districtId),
        );
        const matchesProvince =
          !provinceId || String(partyDistrict?.provinceId) === provinceId;
        const matchesDistrict =
          !districtId || String(partyDistrict?.id) === districtId;
        const matchesQuery = p.name
          .toLowerCase()
          .includes(partyQuery.trim().toLowerCase());
        return matchesProvince && matchesDistrict && matchesQuery;
      }),
    [list, districts, provinceId, districtId, partyQuery],
  );
  const { pageItems, pagination, resetPage } = usePagination(filteredParties);
  const provinceDistricts = useMemo(
    () => districts.filter((d) => String(d.provinceId) === provinceId),
    [districts, provinceId],
  );

  const changeProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextProvinceId = e.target.value;
    setProvinceId(nextProvinceId);
    setDistrictId("");
    setPartyQuery("");
    resetPage();
  };

  const add = async () => {
    // TODO: Create a party through the backend API and update shared state from the response.
  };
  const openEdit = (party: Party) => {
    const partyDistrict =
      districts.find((d) => String(d.id) === String(party.districtId)) ||
      districts.find((d) => String(d.id) === districtId);
    setEditingParty(party);
    setProvinceId(String(partyDistrict?.provinceId ?? provinceId));
    setDistrictId(String(partyDistrict?.id ?? districtId));
    setName(party.name);
    setSaveError("");
    setModalOpen(true);
  };
  const saveEdit = () => {
    // TODO: Update the party through the backend API and use the response to refresh shared state.
  };
  const remove = (id) => {
    // TODO: Delete this party through the backend API, then refresh shared state.
  };

  return (
    <div>
      <PageHeader
        title="Party Nominations"
        description="Register parties for each configured district."
        action={
          <Button
            icon={Plus}
            onClick={() => {
              setEditingParty(null);
              setName("");
              setSaveError("");
              setModalOpen(true);
            }}
          >
            Add Party
          </Button>
        }
      />
      <Card>
        <div className="form-grid nomination-filters">
          <label>
            <span className="nomination-filter-label">
              <MapPin size={14} /> Province
            </span>
            <select
              className="input"
              value={provinceId}
              onChange={changeProvince}
            >
              <option value="">Select province</option>
            </select>
          </label>
          <label>
            <span className="nomination-filter-label">
              <Building2 size={14} /> District
            </span>
            <select
              className="input"
              value={districtId}
              onChange={(e) => {
                setDistrictId(e.target.value);
                resetPage();
              }}
              disabled={!provinceId}
            >
              <option value="">
                {!provinceId ? "Select province first" : "Select district"}
              </option>
            </select>
          </label>
          <label>
            <span className="nomination-filter-label">
              <Search size={14} /> Search party
            </span>
            <input
              className="input"
              type="search"
              placeholder="Enter party name"
              value={partyQuery}
              onChange={(e) => {
                setPartyQuery(e.target.value);
                resetPage();
              }}
            />
          </label>
          <ClearFiltersButton
            onClick={() => {
              setProvinceId("");
              setDistrictId("");
              setPartyQuery("");
              resetPage();
            }}
          />
        </div>
      </Card>
      <Card>
        <div className="card-title">
          <h3>Registered parties</h3>
          <p>
            {districts.find((d) => d.id === Number(districtId))?.name} ·{" "}
            {filteredParties.length} shown / {list.length} registered
          </p>
        </div>
        <div className="table-scroll">
          <table className="data-table registered-parties-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Party</th>
                <th>Province</th>
                <th>District</th>
                <th className="registered-parties-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="module-empty">
                  Connect the party API to load records.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {!filteredParties.length && (
          <div className="module-empty">
            {partyQuery
              ? "No parties match your search."
              : "No parties registered for this district yet."}
          </div>
        )}
        <Pagination
          {...(pagination || {
            page: 1,
            pageCount: 1,
            total: filteredParties.length,
            pageSize: 10,
            setPage: () => {},
          })}
        />
      </Card>
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
            aria-labelledby="party-dialog-title"
          >
            <div className="crud-modal-heading">
              <div>
                <span className="crud-modal-icon">
                  <Users size={19} />
                </span>
                <div>
                  <h3 id="party-dialog-title">
                    {editingParty ? "Edit party" : "Add party"}
                  </h3>
                  <p>
                    {editingParty
                      ? "Update the party details below."
                      : "Register a party for the selected district."}
                  </p>
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setModalOpen(false);
                  setEditingParty(null);
                }}
                aria-label="Close"
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingParty ? saveEdit() : add();
              }}
            >
              <label className="modal-field">
                Province
                <select
                  className="input"
                  value={provinceId}
                  onChange={(e) => {
                    setProvinceId(e.target.value);
                    setDistrictId("");
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
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  disabled={!provinceId}
                  required
                >
                  <option value="">
                    {!provinceId
                      ? "Select province first"
                      : "Select a district"}
                  </option>
                </select>
              </label>
              <p className="seat-allocation-empty-hint">
                Connect the province and district APIs to populate these
                selectors.
              </p>
              <label className="modal-field">
                Party name
                <input
                  autoFocus
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter party name"
                  required
                  maxLength={100}
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
                  onClick={() => {
                    setModalOpen(false);
                    setEditingParty(null);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  icon={editingParty ? SquarePen : Plus}
                  disabled={saving || !districtId}
                >
                  {saving
                    ? "Saving…"
                    : editingParty
                      ? "Save changes"
                      : "Add party"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
