auth.settings.expiration=1800
@auth.requires_login()
def coursesList():
    auth.settings.expiration=1800
    return locals()
@auth.requires_login()
def coursesData():
    rows=db(db.courses).select()
    return locals()
@auth.requires_login()
def schedulesData():
    rows=db(db.courseSchedules).select()
    return locals()
auth.settings.expiration = 1 
@auth.requires_login()
def yourCourses():
    auth.settings.expiration=1800
    return locals()
@auth.requires_login()
def regsData():
    rows=db(db.studentsRegs.studentId==auth.user.id).select()
    return locals()
@auth.requires_login()
def regCount():
    regs=db(db.studentsRegs.coursed).select(db.studentsRegs.coursed)
    return locals()
@auth.requires_login()
def addCourse():
    courseId = int(request.args(0))
    db.studentsRegs.insert(studentId=auth.user.id,coursed=courseId)
    msg=courseId
    redirect(URL('yourCourses'))
    return locals()
@auth.requires_login()
@auth.requires_login()
def newsData():
    rows=db(db.news).select(orderby=~db.news.timeAndDate)
    return locals()
@auth.requires_login()
def StudentProfile():
    auth.settings.expiration=1800
    coursesCount=db(db.studentsRegs.studentId==auth.user.id).count()
    return locals()
@auth.requires_login()
def deleteCourse():
    regId = int(request.args(0))
    db(db.studentsRegs.id==regId).delete()
    msg=regId
    redirect(URL('yourCourses'))
    return locals()
@auth.requires_login()
@auth.requires_membership('admin')
def controlPanal():
    return locals()
@auth.requires_login()
@auth.requires_membership('admin')
def analytics():         
    userCount=db(db.auth_user.id).count()
    return locals()
# -------------------------courses deteils-----------------------------------
@auth.requires_login()
def coursesDeteils():         
    code  = request.args(0)
    name  = request.args(1)
    Description = request.args(2)
    Instructor = request.args(3)
    Prerequisites = request.args(4)
    Days = request.args(5)
    Time = request.args(6)
    Room = request.args(7)
    Capacity = request.args(8)
    return locals()
