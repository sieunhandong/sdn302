const styles = {
    container: {
        width: "90%",
        margin: "20px auto",
        fontFamily: "'Arial', sans-serif",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    filterSection: {
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        overflow: "hidden",
    },
    th: {
        backgroundColor: "#007BFF",
        color: "white",
        padding: "10px",
        textAlign: "left",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #ddd",
    },
    btn: {
        padding: "8px 12px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        marginRight: "5px",
    },
    btnSuccess: {
        backgroundColor: "#28a745",
        color: "white",
    },
    btnDanger: {
        backgroundColor: "#dc3545",
        color: "white",
    },
};

export default styles;
