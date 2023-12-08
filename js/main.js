document.addEventListener("DOMContentLoaded", (event) => {
/*button filter*/
let openDropdown = function (elem) {
    actionDropdown(elem);
}

let blockDrop = document.getElementById("js-filter-block"),
    buttonFilter = document.getElementById("js-filter-button");

buttonFilter.addEventListener( 'click', openDropdown.bind(null,blockDrop));

document.addEventListener( 'click', (e) => {
	const withinBoundaries = e.composedPath().includes(blockDrop);
 	if ( ! withinBoundaries ) {
		actionDropdown(blockDrop,'close');
    }
})

document.addEventListener('keydown', function(e) {
	if( e.keyCode == 27 ){
		actionDropdown(blockDrop,'close');
	}
});

function actionDropdown(elem, bl_action) {
    let nameDrop = elem;
    const nameFilter = nameDrop.querySelector('.filter-lists');
    const nameListFilterDefault = nameDrop.querySelector('.filter-list-items[data-id="0"]');
    if (!bl_action) {
        nameDrop.classList.toggle("active");
        checkIsScroll(nameListFilterDefault, nameFilter);
    }
    else if (bl_action == 'close') {
        if (nameDrop.classList.contains('active')) {
            nameDrop.classList.remove('active');
        }
    }
    
}

/*tabs*/
const showTab = (elTabBtn) => {
    const elTab = elTabBtn.closest('.filter-dropdown');
    if (elTabBtn.classList.contains('active')) {
      return;
    }
    const targetId = elTabBtn.dataset.targetId;
    const elTabPane = elTab.querySelector(`.filter-list-items[data-id="${targetId}"]`);
    const elFilterShow = elTab.querySelector(`.filter-selected[data-id="${targetId}"]`);
    if (elTabPane) {
        elTab.querySelectorAll('.active').forEach(element => {
            element.classList.remove('active');
        });
        elTabBtn.classList.add('active');
        elTabPane.classList.add('active');
        elFilterShow.classList.add('active');
        checkIsScroll(elTabPane, elTabPane.closest('.filter-lists'),true);
        
    }
}

document.addEventListener('click', (e) => {
    if (e.target && !e.target.closest('.tab-item')) {
      return;
    }
    const elTabBtn = e.target.closest('.tab-item');
    showTab(elTabBtn);
});

/*checkbox*/
document.addEventListener('click', (e) => {
    if (e.target && !e.target.closest('.custom-checkbox')) {
      return;
    }
    if (e.target.closest('.custom-checkbox input[type="checkbox"]') ) {
        const elCheckbox = e.target.closest('.custom-checkbox');
        objCheckbox = elCheckbox.querySelector('input[type="checkbox"]');
        updateFilterSize(objCheckbox);
        let idBlockCheckbox = e.target.dataset.targetId;
        checkIsScroll(e.target.closest(`.filter-list-items[data-id="${idBlockCheckbox}"]`), e.target.closest('.filter-lists'));
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.selected-item-remove') ) {
        const elRemove = e.target.closest('.selected-item');
        let nameRemove = elRemove.dataset.idname;
        let parentBl = e.target.closest('.filter-dropdown');
        let checkboxUpd = parentBl.querySelector(`input[data-idname="${nameRemove}"`);
        updateFilterSize(checkboxUpd);
    }
});

let objCheckbox;
const setChecked = new Set();

function updateFilterSize(objCheck) {
    if (!setChecked.has(objCheck)){
        updateSelectedList(objCheck, 'add');
        setChecked.add(objCheck);
    }
    else {
        updateSelectedList(objCheck, 'remove');
        objCheck.checked = false;
        setChecked.delete(objCheck);
    }
    if (setChecked.size) {
        buttonFilter.classList.add('show-size');
    }
    else {
        buttonFilter.classList.remove('show-size');
    }
    buttonFilter.querySelector('.filter-size').innerHTML = setChecked.size;
}

function updateSelectedList(objSelected, type) {

    let parentActive = objSelected.closest('.filter-dropdown'),
        blockActiveSelected = parentActive.querySelector(`.filter-selected[data-id="${objSelected.dataset.targetId}"`);
    switch(type){
        case 'add':
            let lineSelected = `<div class="selected-item" data-idname="${objSelected.dataset.idname}" data-target-id="${objSelected.dataset.targetId}">
                <span>${objSelected.value}</span><span class="selected-item-remove"></span>
            </div>`;
            blockActiveSelected.innerHTML += lineSelected;
        break;
        case 'remove':
            if (!objSelected.name && objSelected.dataset.idname) {
                objSelected.name = objSelected.dataset.idname;
            }
            let removeEl = blockActiveSelected.querySelector(`.selected-item[data-idname="${objSelected.dataset.idname}"]`);
            removeEl.remove();
        break;
    }
    if (blockActiveSelected.querySelectorAll('.selected-item').length){
        blockActiveSelected.classList.add('show-selected');
    }
    else {
        blockActiveSelected.classList.remove('show-selected');
    }
    if(setChecked.has(objSelected)){
        return;
    }  
}

/*check scroll/shadow*/
let blockScroll = document.querySelector('.filter-lists');
blockScroll.addEventListener('scroll', function() {
    checkShadow(this);
});

function checkShadow(elem) {  
    let objCheck = elem;
    if (objCheck.scrollHeight === objCheck.scrollTop + objCheck.clientHeight) {
        objCheck.classList.add('shadow-off');
    }
    else {
        objCheck.classList.remove('shadow-off');
    }
}

function checkIsScroll(elem, elemContainer, changeTab) {
    if (changeTab){
        elemContainer.scrollTop=0;
    }
    if (elem.offsetHeight > elemContainer.clientHeight) {
        elemContainer.classList.add('scroll-enable');
    }
    else {
        elemContainer.classList.remove('scroll-enable');
    }
    checkShadow(elemContainer);
}
});