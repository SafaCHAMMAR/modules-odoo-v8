# -*- coding: utf-8 -*-

from openerp import models, fields, api

class test_candidat(models.Model):
     _inherit='res.partner'
     candidat=fields.Boolean('Candidat')

