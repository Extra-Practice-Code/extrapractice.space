let objects = document.querySelectorAll('#objects input');

console.log(objects);

for (obj of objects) {
    // console.log(obj);
    obj.addEventListener('change', (e) => {
        console.log(e.target.checked);
        // console.log(obj);
        if (e.target.checked) {
            console.log("Checkbox is checked..");
            console.log(e.target.dataset.target);
            document.querySelectorAll(`.${e.target.dataset.target}`).forEach((item) => {
                item.style.display = 'block';
            });
        } else {
            console.log("Checkbox is not checked..");
            document.querySelectorAll(`.${e.target.dataset.target}`).forEach((item) => {
                item.style.display = 'none';
            });
        }
    });
}