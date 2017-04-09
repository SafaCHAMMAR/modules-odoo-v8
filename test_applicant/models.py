# -*- coding: utf-8 -*-

from openerp import models, fields, api

class test_applicant(models.Model):
	_name = 'test_applicant.test_applicant'
	_inherit='hr.applicant'
	candidate_id=fields.Many2one('test_candidat.test_candidat',string="applicants")
	att=fields.Char("###############################################")
