import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchEvaluations, createEvaluation, updateEvaluation } from "../../services/EvaluationService";
import styles from "./style";

const EvaluationIntern = ({ onSave = () => {} }) => {
    const [searchParams] = useSearchParams();
    const internId = searchParams.get("intern_id");
    const type = searchParams.get("type");

    const [scores, setScores] = useState(null);
    const [evaluationId, setEvaluationId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvaluation = async () => {
            if (!internId || !type) return;
            try {
                const response = await searchEvaluations(internId, type);
                console.log("API Response:", response);

                if (response.status === 'OK' && response.data.length > 0) {
                    const existingEvaluation = response.data[0];
                    setScores({
                        intern_id: internId,
                        type: type,
                        technical_skills_score: existingEvaluation.technical_skills_score || 0,
                        soft_skills_score: existingEvaluation.soft_skills_score || 0,
                        attitude_score: existingEvaluation.attitude_score || 0,
                        total_score: existingEvaluation.total_score || 0,
                        comment: existingEvaluation.comment || "",
                    });
                    setEvaluationId(existingEvaluation._id);
                } else {
                    setScores({
                        intern_id: internId,
                        type: type,
                        technical_skills_score: 0,
                        soft_skills_score: 0,
                        attitude_score: 0,
                        total_score: 0,
                        comment: "",
                    });
                }
            } catch (error) {
                console.error("Error fetching evaluation:", error);
                setError("Lỗi khi tải dữ liệu.");
            }
        };
        fetchEvaluation();
    }, [internId, type]);

    useEffect(() => {
        console.log("Updated Scores State:", scores);
    }, [scores]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let numericValue = name === "comment" ? value : parseFloat(value) || 0;

        if (typeof numericValue === "number" && numericValue < 0) {
            setError("⚠ Điểm không thể là số âm!");
            return;
        }else if (typeof numericValue === "number" && numericValue > 10) {
            setError("⚠ Điểm không trên 10!");
            return;
        }
         else {
            setError("");
        }

        setScores((prev) => {
            const newScores = {
                ...prev,
                [name]: numericValue,
            };
            newScores.total_score = 
                (newScores.technical_skills_score * 0.3) + 
                (newScores.soft_skills_score * 0.3) + 
                (newScores.attitude_score * 0.4);
            return newScores;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!scores) return;

        if (error) {
            alert("⚠ Lỗi: " + error);
            return;
        }

        try {
            let response;
            if (evaluationId) {
                response = await updateEvaluation(evaluationId, scores);
            } else {
                response = await createEvaluation(scores);
            }

            if (response.status === "OK") {
                console.log(evaluationId,scores); 
                alert(evaluationId ? "✅ Cập nhật thành công!" : "✅ Lưu thành công!");
                if (!evaluationId) setEvaluationId(response.data._id);
            } else {
                alert("❌ Lỗi: " + response.message);
            }

            if (typeof onSave === "function") {
                onSave(scores);
            }
        } catch (error) {
            console.error("Error updating evaluation:", error);
            alert("❌ Lỗi khi cập nhật dữ liệu!");
        }
    };

    if (!scores) return <p>Loading...</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Grade Report for {internId}</h2>
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>GRADE CATEGORY</th>
                        <th style={styles.th}>GRADE ITEM</th>
                        <th style={styles.th}>WEIGHT</th>
                        <th style={styles.th}>VALUE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.td}>{type}</td>
                        <td style={styles.td}>Major Knowledge and Skills</td>
                        <td style={styles.td}>30%</td>
                        <td style={styles.td}>
                            <input type="number" name="technical_skills_score" value={scores.technical_skills_score} onChange={handleChange} style={styles.input} />
                        </td>
                    </tr>
                    <tr>
                        <td style={styles.td}></td>
                        <td style={styles.td}>Soft Skills</td>
                        <td style={styles.td}>30%</td>
                        <td style={styles.td}>
                            <input type="number" name="soft_skills_score" value={scores.soft_skills_score} onChange={handleChange} style={styles.input} />
                        </td>
                    </tr>
                    <tr>
                        <td style={styles.td}></td>
                        <td style={styles.td}>Attitude</td>
                        <td style={styles.td}>40%</td>
                        <td style={styles.td}>
                            <input type="number" name="attitude_score" value={scores.attitude_score} onChange={handleChange} style={styles.input} />
                        </td>
                    </tr>
                    <tr>
                        <td style={styles.td}><strong>Total</strong></td>
                        <td style={styles.td}><strong>Total</strong></td>
                        <td style={styles.td}><strong>100%</strong></td>
                        <td style={styles.td}>
                            <input type="number" name="total_score" value={scores.total_score} readOnly style={{ ...styles.input, backgroundColor: "#f0f0f0" }} />
                        </td>
                    </tr>
                </tbody>
            </table>

            <label style={styles.label}>Comment</label>
            <textarea name="comment" value={scores.comment} onChange={handleChange} style={styles.textarea} />
            <button style={styles.button} onClick={handleSubmit}>{evaluationId ? "Update" : "Save"}</button>
        </div>
    );
};

export default EvaluationIntern;
