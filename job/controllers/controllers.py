# -*- coding: utf-8 -*-
from openerp import http

# class Job(http.Controller):
#     @http.route('/job/job/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/job/job/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('job.listing', {
#             'root': '/job/job',
#             'objects': http.request.env['job.job'].search([]),
#         })

#     @http.route('/job/job/objects/<model("job.job"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('job.object', {
#             'object': obj
#         })