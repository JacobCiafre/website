function makeGetRequest(url) {
    return new Promise(function (resolve, reject) {
        fetch(url).then(
            (response) => {
                let result = response.json();
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

async function main() {
    if (document.getElementById("home_main_body_div")) {
        // main body that only runs on this page
        document.undergradData = await makeGetRequest('/undergraduate');
        document.gradData = await makeGetRequest('/graduate');
        document.toggledUndergrad = 0;

        document.getElementById("undergrad-tag").addEventListener('click', toggleCourses)
        document.getElementById("grad-tag").addEventListener('click', toggleCourses)

        let changeLine = (window.innerHeight / 2 * 0.9) > window.scrollY //true for above
        document.changeLine = changeLine
        if (!changeLine) {
            document.getElementById("about-me-text").classList.remove("text-transition")
        }

        document.addEventListener('scroll', headerOnScreen)

        drawAcademics()
        drawFilters()
        drawAcademics(filters = ['all'], grad = true)

    }
};


function headerOnScreen(event) {
    let windowHeight = (window.innerHeight / 2 * 0.9)
    let currentScroll = window.scrollY
    let changeLine = document.changeLine //true for above
    // getting element done inside conditional to avoid unnecessary queries
    if (currentScroll > windowHeight && changeLine) {
        document.changeLine = false
        document.getElementById("about-me-text").querySelectorAll('.transition-candidate').forEach(el => {
            el.classList.remove("text-transition")
        })
    } else if (currentScroll < windowHeight && !changeLine) {
        document.changeLine = true
        document.getElementById("about-me-text").querySelectorAll('.transition-candidate').forEach(el => {
            el.classList.add("text-transition")
        })
    }
}

function toggleCourses(event) {

    if (event.target.id === 'undergrad-tag') {
        if (document.toggledUndergrad === 0) {
            drawAcademics()
        }
        document.toggledUndergrad += 1
        document.getElementById("home__undergrad-body").classList.toggle('noShow')
        document.getElementById("undergrad-tag").classList.toggle('invert')
        document.getElementById("undergrad-body-header").classList.toggle('noShow')
        document.getElementById('filters-div').classList.toggle('noShow')

    }
    if (event.target.id === 'grad-tag') {
        let gradBody = document.getElementById("home__grad-body").classList
        gradBody.toggle('noShow')
        gradBody.toggle('text-transition')
        document.getElementById("grad-tag").classList.toggle('invert')
        document.getElementById("grad-body-header").classList.toggle('noShow')

    }
}

function applyFilters() {

    let allFilters = []
    let filterElements = document.querySelectorAll(".filter-button-element")

    filterElements.forEach(el => {
        if (el.checked === true) {
            allFilters.push(el.getAttribute('data-id'))
        }
    });

    if (allFilters.length === 0) {

        document.getElementById("home__undergrad-body").innerHTML = '<div class="course-list-element text-transition">No filters are selected</div>'

        return
    }
    drawAcademics(filters = allFilters)
}


function drawAcademics(filters = ['all'], grad = false) {

    let classData = null
    let idName = null

    if (!grad) {
        classData = document.undergradData
        idName = "home__undergrad-body"
    } else {
        classData = document.gradData
        idName = "home__grad-body"
    }


    let addedAcademicDivHTML = ''
    let classKeys = Object.keys(classData)

    let sortedAcademics = []

    document.getElementById(idName).innerHTML = ""
    classKeys.forEach(el => {
        // syntax for checking if they contain a common item as filter
        if (filters.includes(classData[el]['filter_name']) || filters.includes('all') || grad) {
            sortedAcademics.push(classData[el]['subject_name'])

        }
    });

    sortedAcademics.sort()
    sortedAcademics.forEach(el => {
        addedAcademicDivHTML += `<div class="course-list-element text-transition
        ">${el}</div>`
    })

    document.getElementById(idName).insertAdjacentHTML("beforeend", addedAcademicDivHTML)
}

function drawFilters() {

    let undergradData = document.undergradData
    let academicsList = Object.keys(undergradData)

    let subjectsList = []
    let addedFilterDivHTML = ''

    // search courselist only take subject-tags
    academicsList.forEach(el => {
        subjectsList.push(undergradData[el]['filter_name'])
    });

    // Get unique tags
    let uniqueSubjects = subjectsList.filter(onlyUnique).sort();
    let uniqueID = []

    // loop through unique subjects to create checkboxes
    addedFilterDivHTML += '<div class="filter-box-elements-container">'
    uniqueSubjects.forEach((el, index) => {
        uniqueID.push(`home__academic_filter_category_${el.replace(/\s+/g, '')}`)
        addedFilterDivHTML += '<div class="filter-box-element">'
        addedFilterDivHTML += `<input type="checkbox" class="filter-button-element" data-id="${el}" name="${el}" id="${uniqueID[index]}">`
        addedFilterDivHTML += `<label for="${uniqueID[index]}">${el}</label>`
        addedFilterDivHTML += "</div>"
    });
    addedFilterDivHTML += "</div>"

    document.getElementById("filters-div").insertAdjacentHTML("beforeend", addedFilterDivHTML)

    // default check all buttons on creation
    document.querySelectorAll(".filter-button-element").forEach(el => {
        el.checked = true;
    })

    // event listeners for new buttons
    for (let i = 0; i < uniqueID.length; ++i) {

        document.getElementById(uniqueID[i]).addEventListener('click', applyFilters)

    }

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

main();