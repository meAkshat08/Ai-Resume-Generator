// pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { deleteUser, getUserResumes } from "../api/ResumeService";
import toast from "react-hot-toast";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setUser(loggedInUser);
        }

        const fetchResumes = async () => {
            try {
                const fetchedResumes = await getUserResumes();
                setResumes(fetchedResumes);
            } catch (error) {
                toast.error("Failed to fetch resumes");
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();
    }, [navigate]);

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to permanently delete your account and all your data?")) {
            try {
                await deleteUser(user.email);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                toast.success("Account deleted successfully!");
                navigate("/register");
            } catch (error) {
                toast.error("Failed to delete account");
            }
        }
    };

    if (!user || loading) return null;

    return (
        <div className="min-h-screen bg-base-100 text-gray-200">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Your Dashboard</h1>
                    <p className="text-lg text-gray-400 mt-2">Welcome back, {user.fullName}!</p>
                </div>

                <div className="card bg-neutral/80 backdrop-blur-md shadow-2xl border border-primary/20 mb-8">
                    <div className="card-body">
                        <h2 className="card-title text-2xl text-white">My Resumes</h2>
                        {resumes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {resumes.map(resume => (
                                    <div key={resume.id} className="card bg-base-100/50 shadow-lg">
                                        <div className="card-body">
                                            <h3 className="card-title">Resume - {resume.id}</h3>
                                            <div className="card-actions justify-end">
                                                {/* We would link to a view page here in a real app */}
                                                <button className="btn btn-primary btn-sm">View</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 mt-4">You haven't generated any resumes yet. <Link to="/generate-resume" className="link link-primary">Create one now!</Link></p>
                        )}
                    </div>
                </div>

                <div className="card bg-neutral/80 backdrop-blur-md shadow-2xl border border-error/20">
                    <div className="card-body">
                        <h2 className="card-title text-2xl text-error">Account Settings</h2>
                        <p className="text-gray-400">Permanently delete your account and all associated data.</p>
                        <div className="card-actions justify-end">
                            <button onClick={handleDeleteAccount} className="btn btn-error btn-outline">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;