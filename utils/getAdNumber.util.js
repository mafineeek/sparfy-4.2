const getAdNumber = () => {
    const all = db.prepare("SELECT * FROM ads").all();
    return all.length + 1;
}

exports.getAdNumber = getAdNumber;