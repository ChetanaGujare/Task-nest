export default function Stats({ tasks }) {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const pending = total - done;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    const circumference = 2 * Math.PI * 28;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <>
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <div className="text-uppercase text-muted small fw-semibold">Today's Progress</div>
                        <h5 className="mb-0 fw-bold gradient-text">TaskNest Dashboard</h5>
                        <small className="text-muted">{pending} tasks remaining</small>
                    </div>
                    <div className="position-relative" style={{ width: 70, height: 70 }}>
                        <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="35" cy="35" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                            <circle
                                cx="35" cy="35" r="28"
                                stroke="#4f46e5" strokeWidth="6"
                                fill="none" strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                            />
                        </svg>
                        <span className="position-absolute top-50 start-50 translate-middle fw-bold small">
                            {pct}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="row text-center border-top pt-3 g-0">
                <div className="col-4">
                    <div className="fw-bold fs-5 gradient-text">{total}</div>
                    <small className="text-muted">Total</small>
                </div>
                <div className="col-4 border-start border-end">
                    <div className="fw-bold fs-5 gradient-text">{done}</div>
                    <small className="text-muted">Done</small>
                </div>
                <div className="col-4">
                    <div className="fw-bold fs-5 gradient-text">{pending}</div>
                    <small className="text-muted">Pending</small>
                </div>
            </div>

            <div className="progress progress-thin mt-3">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${pct}%`, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                ></div>
            </div>
        </>
    );
}