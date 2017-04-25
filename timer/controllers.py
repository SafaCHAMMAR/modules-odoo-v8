# -*- coding: utf-8 -*-
"""import logging
import werkzeug
import openerp
from openerp.addons.auth_signup.res_users import SignupError
from openerp.addons.web.controllers.main import ensure_db
from openerp import http
from openerp.http import request

_logger = logging.getLogger(__name__)

class WebsiteSurvey(http.Controller):"""


# class Timer(http.Controller):
#     @http.route('/timer/timer/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/timer/timer/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('timer.listing', {
#             'root': '/timer/timer',
#             'objects': http.request.env['timer.timer'].search([]),
#         })

#     @http.route('/timer/timer/objects/<model("timer.timer"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('timer.object', {
#             'object': obj
#         })