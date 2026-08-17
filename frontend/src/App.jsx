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
        const createdAtText = person.createdAt
            ? new Date(person.createdAt).toLocaleString().toLowerCase()
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
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl font-semibold">
                    Loading Follow-Up Manager...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* ==================================
                HEADER
            ================================== */}

            <header className="bg-white shadow-sm border-b">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo / Application Name */}

                    <button
                        onClick={() => {
                            setCurrentPage("dashboard");
                            setSelectedPerson(null);
                        }}
                        className="text-2xl font-bold text-blue-600"
                    >
                        Follow-Up Manager
                    </button>

                    <button
                        onClick={() => {
                            logout();
                            setAuthPage("login");
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-sm hover:bg-red-700 transition"
                    >
                        Logout
                    </button>

                    <nav className="flex gap-3">

                        <button
                            onClick={() => {
                                setCurrentPage("dashboard");
                                setSelectedPerson(null);
                            }}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-100 to-blue-100 text-blue-700 font-semibold hover:from-sky-200 hover:to-blue-200 transition"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() => {
                                setCurrentPage("followers");
                                setSelectedPerson(null);
                            }}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 font-semibold hover:from-violet-200 hover:to-purple-200 transition"
                        >
                            FollowUpList
                        </button>

                        <button
                            onClick={() => {
                                setCurrentPage("add");
                                setSelectedPerson(null);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition"
                        >
                            + Add New Guest
                        </button>

                    </nav>

                </div>

            </header>

            {/* ==================================
                ERROR
            ================================== */}

            {error && (
                <div className="max-w-7xl mx-auto px-6 pt-6">

                    <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                        {error}
                    </div>

                </div>
            )}

            {/* ==================================
                PAGE CONTENT
            ================================== */}

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* ==================================
                    DASHBOARD
                ================================== */}

                {currentPage === "dashboard" && (
                    <Dashboard
                        people={people}
                        onAddNewGuest={() => setCurrentPage("add")}
                        onOpenList={() => setCurrentPage("followers")}
                    />
                )}

                {/* ==================================
                    ADD FOLLOWER
                ================================== */}

                {currentPage === "add" && (
                    <AddGuest
                        onBack={() => setCurrentPage("dashboard")}
                        onPersonCreated={handlePersonCreated}
                    />
                )}

                {/* ==================================
                    FOLLOWERS LIST
                ================================== */}

                {currentPage === "followers" && (
                    <GuestList
                        people={people}
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

                {/* ==================================
                    DETAILS
                ================================== */}

                {currentPage === "details" && selectedPerson && (

                    <div>

                        <button
                            onClick={() => {
                                setCurrentPage("followers");
                                setSelectedPerson(null);
                            }}
                            className="mb-6 text-blue-600 hover:underline"
                        >
                            ← Back to Followers
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

                {/* ==================================
                    EDIT FOLLOWER
                ================================== */}

                {currentPage === "edit" && selectedPerson && (

                    <div>

                        <button
                            onClick={() => {
                                setCurrentPage("followers");
                                setSelectedPerson(null);
                            }}
                            className="mb-6 text-blue-600 hover:underline"
                        >
                            ← Back to Guest Follow-Up List
                        </button>

                        <div className="bg-white rounded-xl shadow-sm p-6">

                            <h1 className="text-2xl font-bold mb-6">
                                Edit Guest
                            </h1>

                            <PersonForm
                                editingPerson={selectedPerson}
                                onPersonCreated={async () => {
                                    await loadPeople();

                                    alert(
                                        "Guest updated successfully!"
                                    );

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