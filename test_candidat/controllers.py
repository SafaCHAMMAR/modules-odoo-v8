# -*- coding: utf-8 -*-
from openerp import http

# class TestCandidat(http.Controller):
#     @http.route('/test_candidat/test_candidat/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/test_candidat/test_candidat/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('test_candidat.listing', {
#             'root': '/test_candidat/test_candidat',
#             'objects': http.request.env['test_candidat.test_candidat'].search([]),
#         })

#     @http.route('/test_candidat/test_candidat/objects/<model("test_candidat.test_candidat"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('test_candidat.object', {
#             'object': obj
#         })