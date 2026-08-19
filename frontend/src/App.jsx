import { useEffect, useState } from "react";
import api from "./services/api";
import * as XLSX from "xlsx";

import PersonForm from "./components/PersonForm";
import PersonDetails from "./components/PersonDetails";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GuestList from "./pages/GuestList.jsx";
import AddGuest from "./pages/AddGuest.jsx";
import { useAuth } from "./context/useAuth.js";

const formatDateDisplay = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

function App() {
    const { isAuthenticated, logout } = useAuth();
    const [authPage, setAuthPage] = useState("login");

    const [people, setPeople] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState("dashboard");

    const [selectedPerson, setSelectedPerson] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const loadPeople = async () => {
        try {
            setError("");

            const response = await api.get("/people");

            setPeople(response.data.data || []);
        } catch (error) {
            console.error("Failed to load people:", error);

            setError("Failed to load followers.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = () => {
        if (!people || people.length === 0) {
            alert("No followers available to export.");
            return;
        }

        const excelData = people.map((person, index) => ({
            "S.No": index + 1,
            "Name": person.name || "",
            "Contact No": person.contactNo || "",
            "Location": person.location || "",
            "Invited By": person.invitedBy || "",
            "Card Date": person.entryDate || person.createdAt || "",
            "Health Challenges": Array.isArray(person.healthChallenges)
                ? person.healthChallenges.join(", ")
                : person.healthChallenges || "",
            "Follow-Ups": Array.isArray(person.followUps)
                ? person.followUps
                      .map(
                          (followUp) =>
                              `Follow-up ${followUp.followUpNumber || ""}: ${
                                  followUp.date || ""
                              } - ${followUp.status || ""} - ${
                                  followUp.remark || ""
                              }`
                      )
                      .join(" | ")
                : "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Followers"
        );

        XLSX.writeFile(
            workbook,
            "Follow-Up-Manager-Followers.xlsx"
        );
    };

    useEffect(() => {
        let cancelled = false;

        const fetchPeople = async () => {
            if (!isAuthenticated) {
                if (!cancelled) {
                    setPeople([]);
                    setError("");
                    setLoading(false);
                }
                return;
            }

            try {
                setLoading(true);
                const response = await api.get("/people");

                if (!cancelled) {
                    setPeople(response.data.data || []);
                    setError("");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to load people:", error);

                if (!cancelled) {
                    setError("Failed to load followers.");
                    setLoading(false);
                }
            }
        };

        fetchPeople();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    const handlePersonCreated = async () => {
        await loadPeople();

        alert("Guest added successfully!");

        setCurrentPage("followers");
    };

    const handleViewDetails = (person) => {
        setSelectedPerson(person);

        setCurrentPage("details");
    };

    const handleEdit = (person) => {
        setSelectedPerson(person);

        setCurrentPage("edit");
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this guest?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/people/${id}`);

            setPeople((previousPeople) =>
                previousPeople.filter(
                    (person) => person._id !== id
                )
            );

            alert("Guest deleted successfully.");

            setCurrentPage("followers");
        } catch (error) {
            console.error("Delete failed:", error);

            alert("Failed to delete guest.");
        }
    };

    const filteredPeople = people.filter((person) => {
        const search = searchTerm.toLowerCase();
        const entryDate = person.entryDate || person.createdAt;
        const createdAtText = entryDate
            ? new Date(entryDate).toLocaleString().toLowerCase()
            : "";

        return (
            person.name?.toLowerCase().includes(search) ||
            person.contactNo?.includes(search) ||
            person.location?.toLowerCase().includes(search) ||
            person.invitedBy?.toLowerCase().includes(search) ||
            createdAtText.includes(search)
        );
    });

    if (!isAuthenticated) {
        return authPage === "register" ? (
            <Register
                onRegisterSuccess={() => setAuthPage("login")}
                onSwitchToLogin={() => setAuthPage("login")}
            />
        ) : (
            <Login
                onLoginSuccess={() => setAuthPage("login")}
                onSwitchToRegister={() => setAuthPage("register")}
            />
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3 px-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <div className="text-sm sm:text-base font-semibold text-slate-700">
                    Loading Follow-Up Manager...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
            {/* ==================================
                STICKY RESPONSIVE HEADER
            ================================== */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 py-2.5 sm:py-3">
                        
                        {/* Logo / App Name */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    setCurrentPage("dashboard");
                                    setSelectedPerson(null);
                                }}
                                className="flex items-center gap-2 text-left focus:outline-none"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-xs">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                    Follow-Up Manager
                                </span>
                            </button>

                            {/* Mobile-Only Logout Button */}
                            <button
                                onClick={() => {
                                    logout();
                                    setAuthPage("login");
                                }}
                                className="sm:hidden inline-flex h-8 items-center gap-1 rounded-lg bg-sky-600 px-2.5 text-xs font-semibold text-white shadow-xs hover:bg-sky-700 active:scale-95 transition"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>

                        {/* Navigation Actions */}
                        <nav className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
                            {/* Blue Dashboard Button */}
                            <button
                                onClick={() => {
                                    setCurrentPage("dashboard");
                                    setSelectedPerson(null);
                                }}
                                className={`inline-flex flex-1 sm:flex-initial h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all active:scale-95 ${
                                    currentPage === "dashboard"
                                        ? "bg-blue-600 ring-2 ring-blue-500/30"
                                        : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            >
                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Dashboard</span>
                            </button>

                            {/* Green FollowUpList Button */}
                            <button
                                onClick={() => {
                                    setCurrentPage("followers");
                                    setSelectedPerson(null);
                                }}
                                className={`inline-flex flex-1 sm:flex-initial h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all active:scale-95 ${
                                    currentPage === "followers"
                                        ? "bg-emerald-700 ring-2 ring-emerald-500/30"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                }`}
                            >
                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <span>ViewList</span>
                            </button>

                            {/* Green Add New Guest Button */}
                            <button
                                onClick={() => {
                                    setCurrentPage("add");
                                    setSelectedPerson(null);
                                }}
                                className={`inline-flex flex-1 sm:flex-initial h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all active:scale-95 ${
                                    currentPage === "add"
                                        ? "bg-teal-700 ring-2 ring-teal-500/30"
                                        : "bg-teal-600 hover:bg-teal-700"
                                }`}
                            >
                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="whitespace-nowrap">Add Guest</span>
                            </button>

                            {/* Desktop Logout Button */}
                            <button
                                onClick={() => {
                                    logout();
                                    setAuthPage("login");
                                }}
                                className="hidden sm:inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-3.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-sky-700 active:scale-95"
                            >
                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* ==================================
                ERROR NOTIFICATION
            ================================== */}
            {error && (
                <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4">
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-700 border border-red-200">
                        <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* ==================================
                PAGE CONTENT
            ================================== */}
            <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
                
                {/* DASHBOARD */}
                {currentPage === "dashboard" && (
                    <Dashboard
                        people={people}
                        onAddNewGuest={() => setCurrentPage("add")}
                        onOpenList={() => setCurrentPage("followers")}
                        onLogout={() => {
                            logout();
                            setAuthPage("login");
                        }}
                    />
                )}

                {/* ADD FOLLOWER */}
                {currentPage === "add" && (
                    <AddGuest
                        onBack={() => setCurrentPage("dashboard")}
                        onPersonCreated={handlePersonCreated}
                    />
                )}

                {/* FOLLOWERS LIST */}
                {currentPage === "followers" && (
                    <GuestList
                        people={filteredPeople}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onExportExcel={handleExportExcel}
                        onAddNewGuest={() => setCurrentPage("add")}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        formatDateDisplay={formatDateDisplay}
                    />
                )}

                {/* DETAILS */}
                {currentPage === "details" && selectedPerson && (
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                setCurrentPage("followers");
                                setSelectedPerson(null);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Followers
                        </button>

                        <PersonDetails
                            person={selectedPerson}
                            onBack={() => {
                                setCurrentPage("followers");
                                setSelectedPerson(null);
                            }}
                        />
                    </div>
                )}

                {/* EDIT FOLLOWER */}
                {currentPage === "edit" && selectedPerson && (
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                setCurrentPage("followers");
                                setSelectedPerson(null);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Follow-Up List
                        </button>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
                                Edit Guest
                            </h1>

                            <PersonForm
                                editingPerson={selectedPerson}
                                onPersonUpdated={async () => {
                                    await loadPeople();

                                    alert("Guest updated successfully!");

                                    setSelectedPerson(null);

                                    setCurrentPage("followers");
                                }}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;