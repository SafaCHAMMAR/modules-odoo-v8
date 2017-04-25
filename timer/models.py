# -*- coding: utf-8 -*-

from openerp import models, fields, api

class timer(models.Model):
	_inherit = 'survey.survey'
	time=fields.Float('time')
class timer2(models.Model):
	_inherit='survey.user_input'
	time_elapsed=fields.Float('time elapsed')
