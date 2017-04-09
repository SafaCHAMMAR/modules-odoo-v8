# -*- coding: utf-8 -*-

from openerp import models, fields, api

#class job(models.Model):
	#_name = 'job.job'
	#name = fields.Char()
 

class Job(models.Model):
	_inherit='hr.job'
	survey_id=fields.Many2many('survey.survey','job_survey_rel', 'job_id', 'survey_id', 'surveys')
	    
