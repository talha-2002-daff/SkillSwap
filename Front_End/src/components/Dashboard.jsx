import { useEffect, useState } from "react";
import "../Dashboard.css";

function Dashboard({ user, onLogout }) {
    const [skills, setSkills] = useState([]);
    const [mySkills, setMySkills] = useState([]);
    const [allUserSkills, setAllUserSkills] = useState([]);
    const [swapRequests, setSwapRequests] = useState([]);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [loadingSkills, setLoadingSkills] = useState(true);
    const [loadingMySkills, setLoadingMySkills] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/api/skills")
            .then((response) => response.json())
            .then((data) => {
                setSkills(data);
                setLoadingSkills(false);
            })
            .catch((error) => {
                console.error("Error fetching skills:", error);
                setMessageType("error");
                setLoadingSkills(false);
            });
    }, []);

    const loadMySkills = async () => {
        try {
            setLoadingMySkills(true);

            const response = await fetch(
                `http://localhost:5000/api/user-skills/user/${user.id}`
            );

            const data = await response.json();

            if (response.ok) {
                setMySkills(data);
            }
        } catch (error) {
            console.error("Error loading my skills:", error);
        } finally {
            setLoadingMySkills(false);
        }
    };

    const loadAllUserSkills = async () => {
        try {
            setLoadingStudents(true);

            const response = await fetch(
                "http://localhost:5000/api/user-skills"
            );

            const data = await response.json();

            if (response.ok) {
                setAllUserSkills(data);
            }
        } catch (error) {
            console.error("Error loading students:", error);
        } finally {
            setLoadingStudents(false);
        }
    };

    const loadSwapRequests = async () => {
        try {
            setLoadingRequests(true);

            const response = await fetch(
                `http://localhost:5000/api/swap-requests/user/${user.id}`
            );

            const data = await response.json();

            if (response.ok) {
                setSwapRequests(data);
            }
        } catch (error) {
            console.error("Error loading swap requests:", error);
        } finally {
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            loadMySkills();
            loadAllUserSkills();
            loadSwapRequests();
        }
    }, [user]);

    const handleSkillSelection = async (skillId, type) => {
        setMessage("");
        setMessageType("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/user-skills",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        skill_id: skillId,
                        skill_type: type
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Skill added successfully!");
                setMessageType("success");

                loadMySkills();
                loadAllUserSkills();
            } else if (response.status === 409) {
                setMessage(
                    "Tumi to ei skill add korlain ekbar."
                );
                setMessageType("warning");
            } else {
                setMessage("Something went wrong.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error adding skill:", error);
            setMessage("Could not connect to the backend.");
            setMessageType("error");
        }
    };

    const handleDeleteSkill = async (userSkillId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/user-skills/${userSkillId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Skill deleted successfully.");
                setMessageType("success");

                loadMySkills();
                loadAllUserSkills();
            } else {
                setMessage("Tumi eita apatoto delete korte parba na");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error deleting skill:", error);
            setMessage("Backend ghumay");
            setMessageType("error");
        }
    };

    const handleSendSwapRequest = async (
        receiverId,
        skillId,
        receiverName,
        skillName
    ) => {
        const confirmRequest = window.confirm(
            `Send a swap request to ${receiverName} for ${skillName}?`
        );

        if (!confirmRequest) {
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/swap-requests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sender_id: user.id,
                        receiver_id: receiverId,
                        skill_id: skillId,
                        message:
                            "Choto amra skill adan prodan kori"
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage(
                    "Swap request sent successfully!"
                );
                setMessageType("success");

                loadSwapRequests();
            } else if (response.status === 409) {
                setMessage(
                    data.message ||
                        "You already have a pending request."
                );
                setMessageType("warning");
            } else {
                setMessage(
                    data.message || "Failed to send swap request."
                );
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error sending swap request:", error);
            setMessageType("error");
        }
    };

    const handleUpdateRequest = async (requestId, newStatus) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/swap-requests/${requestId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage(
                    data.message ||
                        `Swap request ${newStatus} successfully.`
                );
                setMessageType("success");

                loadSwapRequests();
            } else {
                setMessage(
                    "Failed to update swap request."
                );
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error updating swap request:", error);
            setMessageType("error");
        }
    };

    const students = {};

    allUserSkills.forEach((item) => {
        if (Number(item.user_id) === Number(user.id)) {
            return;
        }

        if (!students[item.user_id]) {
            students[item.user_id] = {
                id: item.user_id,
                name: item.user_name,
                phone: item.user_phone,
                skills: []
            };
        }

        students[item.user_id].skills.push(item);
    });

    const studentList = Object.values(students);

    const incomingRequests = swapRequests.filter(
        (request) =>
            Number(request.receiver_id) === Number(user.id)
    );

    const sentRequests = swapRequests.filter(
        (request) =>
            Number(request.sender_id) === Number(user.id)
    );

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>SkillSwap</h1>
                    <p>Student Skill Exchange Platform</p>
                </div>
            </div>

            {message && (
                <div className={`message ${messageType}`}>
                    <strong>{message}</strong>
                </div>
            )}

            <div className="dashboard-section">
                <h2>👤 My Profile</h2>

                <div className="profile-grid">

                    <div className="profile-item">
                        <strong>Name</strong>
                        {user.name}
                    </div>

                    <div className="profile-item">
                        <strong>Email</strong>
                        {user.email}
                    </div>

                    <div className="profile-item">
                        <strong>Phone</strong>
                        {user.phone || "phone number to add kore nai"}
                    </div>

                    <div className="profile-item">
                        <strong>Bio</strong>
                        {user.bio || "bio mio add kore nai oi"}
                    </div>

                </div>
            </div>

            <div className="dashboard-section">
                <h2>🎯 My Skills</h2>

                {loadingMySkills ? (
                    <p className="empty-message">
                        Loading your skills...
                    </p>
                ) : mySkills.length === 0 ? (
                    <p className="empty-message">
                        Tomar kono skill in nai apatoto
                    </p>
                ) : (
                    <div className="skills-grid">
                        {mySkills.map((skill) => (
                            <div
                                className="skill-card"
                                key={skill.id}
                            >
                                <h3>{skill.skill_name}</h3>

                                <span
                                    className={
                                        skill.skill_type === "teach"
                                            ? "badge badge-teach"
                                            : "badge badge-learn"
                                    }
                                >
                                    {skill.skill_type === "teach"
                                        ? "I Can Teach"
                                        : "I Want to Learn"}
                                </span>

                                <br />

                                <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                        handleDeleteSkill(skill.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="dashboard-section">
                <h2>📚 Available Skills</h2>

                {loadingSkills ? (
                    <p className="empty-message">
                        Loading skills...
                    </p>
                ) : skills.length === 0 ? (
                    <p className="empty-message">
                        No skills available.
                    </p>
                ) : (
                    <div className="skills-grid">
                        {skills.map((skill) => (
                            <div
                                className="skill-card"
                                key={skill.id}
                            >
                                <h3>{skill.skill_name}</h3>

                                <p>
                                    {skill.description ||
                                        "No description available"}
                                </p>

                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        handleSkillSelection(
                                            skill.id,
                                            "teach"
                                        )
                                    }
                                >
                                    I Can Teach
                                </button>{" "}

                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        handleSkillSelection(
                                            skill.id,
                                            "learn"
                                        )
                                    }
                                >
                                    I Want to Learn
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="dashboard-section">
                <h2>🔎 Find Other Students</h2>

                {loadingStudents ? (
                    <p className="empty-message">
                        Loading students...
                    </p>
                ) : studentList.length === 0 ? (
                    <p className="empty-message">
                        No other students have added skills yet.
                    </p>
                ) : (
                    studentList.map((student) => {

                        const teachingSkills =
                            student.skills.filter(
                                (skill) =>
                                    skill.skill_type === "teach"
                            );

                        const learningSkills =
                            student.skills.filter(
                                (skill) =>
                                    skill.skill_type === "learn"
                            );

                        return (
                            <div
                                className="student-card"
                                key={student.id}
                            >
                                <h3>👤 {student.name}</h3>

                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {student.phone ||
                                        "No phone number available"}
                                </p>

                                <div className="student-skills">
                                    <h4>Can Teach</h4>

                                    {teachingSkills.length === 0 ? (
                                        <p>
                                            No teaching skills added.
                                        </p>
                                    ) : (
                                        teachingSkills.map((skill) => (
                                            <div
                                                key={skill.id}
                                                style={{
                                                    marginBottom: "10px"
                                                }}
                                            >
                                                <span>
                                                    {skill.skill_name}
                                                </span>{" "}

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        handleSendSwapRequest(
                                                            student.id,
                                                            skill.skill_id,
                                                            student.name,
                                                            skill.skill_name
                                                        )
                                                    }
                                                >
                                                    Send Swap Request
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="student-skills">
                                    <h4>Wants to Learn</h4>

                                    {learningSkills.length === 0 ? (
                                        <p>
                                            No learning skills added.
                                        </p>
                                    ) : (
                                        learningSkills.map((skill) => (
                                            <span
                                                className="badge badge-learn"
                                                key={skill.id}
                                            >
                                                {skill.skill_name}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="dashboard-section">
                <h2> Incoming Swap Requests</h2>

                {loadingRequests ? (
                    <p className="empty-message">
                        Loading requests...
                    </p>
                ) : incomingRequests.length === 0 ? (
                    <p className="empty-message">
                        You have no incoming swap requests.
                    </p>
                ) : (
                    incomingRequests.map((request) => (
                        <div
                            className="request-card"
                            key={request.id}
                        >
                            <h3>{request.sender_name}</h3>

                            <p>
                                <strong>Skill:</strong>{" "}
                                {request.skill_name}
                            </p>

                            <p>
                                <strong>Message:</strong>{" "}
                                {request.message || "No message"}
                            </p>

                            <span
                                className={`status status-${request.status}`}
                            >
                                {request.status}
                            </span>

                            {request.status === "pending" && (
                                <div className="request-actions">

                                    <button
                                        className="btn btn-success"
                                        onClick={() =>
                                            handleUpdateRequest(
                                                request.id,
                                                "accepted"
                                            )
                                        }
                                    >
                                        Accept
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                            handleUpdateRequest(
                                                request.id,
                                                "rejected"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="dashboard-section">
                <h2> Sent Swap Requests</h2>

                {loadingRequests ? (
                    <p className="empty-message">
                        Loading requests...
                    </p>
                ) : sentRequests.length === 0 ? (
                    <p className="empty-message">
                        You haven't sent any swap requests.
                    </p>
                ) : (
                    sentRequests.map((request) => (
                        <div
                            className="request-card"
                            key={request.id}
                        >
                            <h3>
                                To: {request.receiver_name}
                            </h3>

                            <p>
                                <strong>Skill:</strong>{" "}
                                {request.skill_name}
                            </p>

                            <p>
                                <strong>Message:</strong>{" "}
                                {request.message || "No message"}
                            </p>

                            <span
                                className={`status status-${request.status}`}
                            >
                                {request.status}
                            </span>
                        </div>
                    ))
                )}
            </div>

            <div className="logout-section">
                <button
                    className="logout-btn"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>

        </div>
    );
}

export default Dashboard;