# -*- coding: utf-8 -*-

# -------------------------------------------------------------------------
# AppConfig configuration made easy. Look inside private/appconfig.ini
# Auth is for authenticaiton and access control
# -------------------------------------------------------------------------
from gluon.contrib.appconfig import AppConfig
from gluon.tools import Auth

# -------------------------------------------------------------------------
# This scaffolding model makes your app work on Google App Engine too
# File is released under public domain and you can use without limitations
# -------------------------------------------------------------------------

if request.global_settings.web2py_version < "2.15.5":
    raise HTTP(500, "Requires web2py 2.15.5 or newer")

# -------------------------------------------------------------------------
# if SSL/HTTPS is properly configured and you want all HTTP requests to
# be redirected to HTTPS, uncomment the line below:
# -------------------------------------------------------------------------
# request.requires_https()

# -------------------------------------------------------------------------
# once in production, remove reload=True to gain full speed
# -------------------------------------------------------------------------
configuration = AppConfig(reload=True)

if not request.env.web2py_runtime_gae:
    # ---------------------------------------------------------------------
    # if NOT running on Google App Engine use SQLite or other DB
    # ---------------------------------------------------------------------
    db = DAL(configuration.get('db.uri'),
             pool_size=configuration.get('db.pool_size'),
             migrate_enabled=configuration.get('db.migrate'),
             check_reserved=['all'])
else:
    # ---------------------------------------------------------------------
    # connect to Google BigTable (optional 'google:datastore://namespace')
    # ---------------------------------------------------------------------
    db = DAL('google:datastore+ndb')
    # ---------------------------------------------------------------------
    # store sessions and tickets there
    # ---------------------------------------------------------------------
    session.connect(request, response, db=db)
    # ---------------------------------------------------------------------
    # or store session in Memcache, Redis, etc.
    # from gluon.contrib.memdb import MEMDB
    # from google.appengine.api.memcache import Client
    # session.connect(request, response, db = MEMDB(Client()))
    # ---------------------------------------------------------------------

# -------------------------------------------------------------------------
# by default give a view/generic.extension to all actions from localhost
# none otherwise. a pattern can be 'controller/function.extension'
# -------------------------------------------------------------------------
response.generic_patterns = [] 
if request.is_local and not configuration.get('app.production'):
    response.generic_patterns.append('*')

# -------------------------------------------------------------------------
# choose a style for forms
# -------------------------------------------------------------------------
response.formstyle = 'bootstrap4_inline'
response.form_label_separator = ''

# -------------------------------------------------------------------------
# (optional) optimize handling of static files
# -------------------------------------------------------------------------
# response.optimize_css = 'concat,minify,inline'
# response.optimize_js = 'concat,minify,inline'

# -------------------------------------------------------------------------
# (optional) static assets folder versioning
# -------------------------------------------------------------------------
# response.static_version = '0.0.0'

# -------------------------------------------------------------------------
# Here is sample code if you need for
# - email capabilities
# - authentication (registration, login, logout, ... )
# - authorization (role based authorization)
# - services (xml, csv, json, xmlrpc, jsonrpc, amf, rss)
# - old style crud actions
# (more options discussed in gluon/tools.py)
# -------------------------------------------------------------------------

# host names must be a list of allowed host names (glob syntax allowed)
auth = Auth(db, host_names=configuration.get('host.names'))

# -------------------------------------------------------------------------
# create all tables needed by auth, maybe add a list of extra fields
# -------------------------------------------------------------------------
auth.settings.extra_fields['auth_user'] = []
auth.define_tables(username=False, signature=False)

# -------------------------------------------------------------------------
# configure email
# -------------------------------------------------------------------------
mail = auth.settings.mailer
mail.settings.server = 'logging' if request.is_local else configuration.get('smtp.server')
mail.settings.sender = configuration.get('smtp.sender')
mail.settings.login = configuration.get('smtp.login')
mail.settings.tls = configuration.get('smtp.tls') or False
mail.settings.ssl = configuration.get('smtp.ssl') or False

# -------------------------------------------------------------------------
# configure auth policy
# -------------------------------------------------------------------------
auth.settings.registration_requires_verification = False
auth.settings.registration_requires_approval = False
auth.settings.reset_password_requires_verification = True

# -------------------------------------------------------------------------  
# read more at http://dev.w3.org/html5/markup/meta.name.html               
# -------------------------------------------------------------------------
response.meta.author = configuration.get('app.author')
response.meta.description = configuration.get('app.description')
response.meta.keywords = configuration.get('app.keywords')
response.meta.generator = configuration.get('app.generator')
response.show_toolbar = configuration.get('app.toolbar')

# -------------------------------------------------------------------------
# your http://google.com/analytics id                                      
# -------------------------------------------------------------------------
response.google_analytics_id = configuration.get('google.analytics_id')

# -------------------------------------------------------------------------
# maybe use the scheduler
# -------------------------------------------------------------------------
if configuration.get('scheduler.enabled'):
    from gluon.scheduler import Scheduler
    scheduler = Scheduler(db, heartbeat=configuration.get('scheduler.heartbeat'))

# -------------------------------------------------------------------------
# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.
#
# More API examples for controllers:
#
# >>> db.mytable.insert(myfield='value')
# >>> rows = db(db.mytable.myfield == 'value').select(db.mytable.ALL)
# >>> for row in rows: print row.id, row.myfield
# -------------------------------------------------------------------------

# -------------------------------------------------------------------------
# after defining tables, uncomment below to enable auditing
# -------------------------------------------------------------------------
# auth.enable_record_versioning(db)
import datetime
dt_now = datetime.datetime.now()
times = str(dt_now.year)+'/'+str(dt_now.month)+'/'+str(dt_now.day)+'  -  '+str(dt_now.hour)+':'+str(dt_now.minute)
db.define_table('courseSchedules',
    Field('days',type='string',notnull=True,requires=IS_IN_SET(['Sunday','Monday ','Tuesday ','Wednesday ','Thursday ','Sunday - Tuesday - Thursday','Monday-Wednesday','Sunday-Thursday','Sunday-Tuesday','Tuesday-Thursday'])) ,
    Field('startTime',type='time',requires=IS_TIME(),notnull=True) ,
    Field('endTime',type='time',requires=IS_TIME(),notnull=True) ,
    Field('room',type='string',requires=IS_NOT_EMPTY(),notnull=True) 

    )
db.define_table('courses',
    Field('code',type='integer',unique=True),
    Field('name',type='string',requires=IS_NOT_EMPTY()), 
    Field('description',type='string',requires=IS_NOT_EMPTY()), 
    Field('instructor',type='string',requires=IS_NOT_EMPTY()),
    Field('schedul',requires = IS_IN_DB(db,db.courseSchedules.id,'%(id)s')), 
    Field('prerequisites',notnull=False,), 
    Field('capacity',type='integer',requires=IS_INT_IN_RANGE(10, 120)), 
    )

db.define_table('studentsRegs',
    Field('studentId',requires = IS_IN_DB(db, db.auth_user.id, '%(id)s'),notnull=True), 
    Field('coursed',requires = IS_IN_DB(db, db.courses.id, '%(id)s'),notnull=True) 
    )
db.define_table('news',
    Field('title',type='string',requires=IS_NOT_EMPTY()),
    Field('timeAndDate',default=times), 
    Field('info',type='text',requires=IS_NOT_EMPTY())
) 


# db.define_table('web2py_session', Field('atime', 'datetime', default=request.now, onupdate=request.now, writable=False, readable=False), Field('expire', 'integer', default=3600, writable=False, readable=False), Field('locked', 'boolean', default=False, writable=False, readable=False), Field('client_ip', default=request.client, writable=False, readable=False), Field('data', 'text', default='{}', writable=False, readable=False))

db.courses.prerequisites.requires = IS_IN_DB(db, 'courses.id', '%(code)s')
# # db.define_table('studentsRegs',
#     Field('',type=(),requires=IS_NOT_EMPTY()) 
#db.thing.owner_id.requires = IS_IN_DB(db, 'person.uuid', '%(name)s')
    