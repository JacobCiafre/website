import sqlite3


def getCourses(table_name) -> dict:
    '''Fetches undergraduate course data and returns json data.\n
    Valid tables are "undergradclasses" and "gradclasses"
    Keys are catelog_id and each contains:
        * subject_name: str
        * filter_name: str
    '''
    try:

        connectionObj = sqlite3.connect('personal-site.db')
        cursorObj = connectionObj.cursor()

        queryStatement = f'SELECT * FROM {table_name}'
        cursorObj.execute(queryStatement)
        courses = cursorObj.fetchall()
        columnHeaders = [description[0]
                         for description in cursorObj.description]

        connectionObj.close()
        assert len(courses) > 0
        assert len(courses[0]) == 5

        coursesDict = dict()

        for course in courses:
            coursesDict.update(
                {course[1]: {columnHeaders[0]: course[0], columnHeaders[3]: course[3]}})

        return coursesDict

    except Exception as error:
        print(error)
        return {"Failed": {"subject_name": "Database Operations Failed", "filter_name": "Diagnostics"}}


if __name__ == "__main__":
    print(getCourses('undergradclasses'))
    print(getCourses('gradclasses'))
    print(getCourses('not a table name'))
