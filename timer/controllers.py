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
import json
import logging
import werkzeug
import werkzeug.utils
import openerp
from datetime import datetime
from math import ceil

from openerp import SUPERUSER_ID
from openerp.addons.web import http
from openerp.addons.web.http import request
from openerp.tools.misc import DEFAULT_SERVER_DATETIME_FORMAT as DTF, ustr


_logger = logging.getLogger(__name__)


class WebsiteSurvey(openerp.addons.survey.controllers.main.WebsiteSurvey):
	# Survey displaying
    @http.route(['/survey/fill/<model("survey.survey"):survey>/<string:token>',
                 '/survey/fill/<model("survey.survey"):survey>/<string:token>/<string:prev>'],
                type='http', auth='public', website=True)
    def fill_survey(self, survey, token, prev=None, **post):
        '''Display and validates a survey'''
        _logger.critical("\n\n ------------- token inf fill/...---------%s \n\n",token)
        _logger.critical("\n\n ************** fill****************\n\n")
        cr, uid, context = request.cr, request.uid, request.context
        survey_obj = request.registry['survey.survey']
        user_input_obj = request.registry['survey.user_input']
        #_logger.critical('\n \n ----token--------%s \n\n',token)
        # Controls if the survey can be displayed
        errpage = self._check_bad_cases(cr, uid, request, survey_obj, survey, user_input_obj, context=context)
        if errpage:
            return errpage

        # Load the user_input
        try:
            user_input_id = user_input_obj.search(cr, SUPERUSER_ID, [('token', '=', token)])[0]
            _logger.critical("\n\n___________ bloc try______\n" )
        except IndexError:  # Invalid token
            return request.website.render("website.403")
        else:
            user_input = user_input_obj.browse(cr, SUPERUSER_ID, [user_input_id], context=context)[0]
            _logger.critical("\n\n ________after try ________________\n\n")
        # Do not display expired survey (even if some pages have already been
        # displayed -- There's a time for everything!)
        errpage = self._check_deadline(cr, uid, user_input, context=context)
        if errpage:
            return errpage

        # Select the right page
        if user_input.state == 'new':  # First page
            _logger.critical("\n ________________state=new________\n")
            page, page_nr, last = survey_obj.next_page(cr, uid, user_input, 0, go_back=False, context=context)
            data = {'survey': survey, 'page': page, 'page_nr': page_nr, 'token': user_input.token}
            if last:
                data.update({'last': True})
            return request.website.render('survey.survey', data)
        elif user_input.state == 'done':  # Display success message
            #ici!!!!! request redirect to another url !!!!
            _logger.critical("\n________________state= done__________\n")
            #return request.redirect('/survey/start/%s/%s' % (survey.id, user_input.token))
            return request.website.render('survey.sfinished', {'survey': survey,
                                                               'token': token,
                                                             'user_input': user_input})
            _logger.critical('\n\n hellooooooooooooooooooooo  \n\n\n')
            #return request.redirect('/survey/thankyou')
        elif user_input.state == 'skip':
            _logger.critical("\n__________________state=skip________________\n")
            flag = (True if prev and prev == 'prev' else False)
            page, page_nr, last = survey_obj.next_page(cr, uid, user_input, user_input.last_displayed_page_id.id, go_back=flag, context=context)

            #special case if you click "previous" from the last page, then leave the survey, then reopen it from the URL, avoid crash
            if not page:
                page, page_nr, last = survey_obj.next_page(cr, uid, user_input, user_input.last_displayed_page_id.id, go_back=True, context=context)

            data = {'survey': survey, 'page': page, 'page_nr': page_nr, 'token': user_input.token}
            if last:
                data.update({'last': True})
            return request.website.render('survey.survey', data)
        else:
            return request.website.render("website.403")


   	# AJAX submission of a page
    @http.route(['/survey/submit/<model("survey.survey"):survey>'],
                type='http', methods=['POST'], auth='public', website=True)
    def submit(self, survey, **post):
        _logger.debug('Incoming data: %s', post)
        _logger.critical('\n \n incoming data: %s',post,'\n \n')
        _logger.critical('\n \n /\/\/\/\ NEW SUBMIT /\/\/\/\/\/\/\/ \n \n')
        # add by safa:Don't forget to delete this line!!!!
        #_logger.critical('\n \n ################################### post[testData]%s \n \n', post["testData"])
        timeElapsed=post["testData"]
        time2=int(timeElapsed)/60 +(float(timeElapsed)%60)/100
        #_logger.critical('\n \n //////////////////////// time2 %s \n \n', time2)
        #####################


        page_id = int(post['page_id'])
        cr, uid, context = request.cr, request.uid, request.context
        survey_obj = request.registry['survey.survey']
        questions_obj = request.registry['survey.question']
        questions_ids = questions_obj.search(cr, uid, [('page_id', '=', page_id)], context=context)
        questions = questions_obj.browse(cr, uid, questions_ids, context=context)

        # Answer validation
        errors = {}
        for question in questions:
            answer_tag = "%s_%s_%s" % (survey.id, page_id, question.id)
            errors.update(questions_obj.validate_question(cr, uid, question, post, answer_tag, context=context))
        ret = {}
        if (len(errors) != 0):
            # Return errors messages to webpage
            ret['errors'] = errors
        else:
            # Store answers into database
            user_input_obj = request.registry['survey.user_input']

            user_input_line_obj = request.registry['survey.user_input_line']
            try:
                user_input_id = user_input_obj.search(cr, SUPERUSER_ID, [('token', '=', post['token'])], context=context)[0]
            except KeyError:  # Invalid token
                return request.website.render("website.403")
            user_input = user_input_obj.browse(cr, SUPERUSER_ID, user_input_id, context=context)
            user_id = uid if user_input.type != 'link' else SUPERUSER_ID
            for question in questions:
                answer_tag = "%s_%s_%s" % (survey.id, page_id, question.id)
                user_input_line_obj.save_lines(cr, user_id, user_input_id, question, post, answer_tag, context=context)

            ######################################################    
            #_logger.critical('\n \n ***************user_input.id %s \n \n',user_input.id)
            cr.execute('update survey_user_input set time_elapsed=%s where id=%s'% (time2, user_input.id))
            #cr.execute('update survey_survey set t1=%s where id=%s'% (time2,user_input.survey_id))
            #_logger.critical('\n \n ----------succes------------- \n \n')
            #_logger.critical('post[button_submit]='+post['button_submit'])
            ######################################################
            
            go_back = post['button_submit'] == 'previous'
            next_page, _, last = survey_obj.next_page(cr, uid, user_input, page_id, go_back=go_back, context=context)
            vals = {'last_displayed_page_id': page_id}
            if next_page is None and not go_back or time2<0:
                vals.update({'state': 'done'})
            else:
                vals.update({'state': 'skip'})
            user_input_obj.write(cr, user_id, user_input_id, vals, context=context)
            ret['redirect'] = '/survey/fill/%s/%s' % (survey.id, post['token'])
            if go_back:
                ret['redirect'] += '/prev'
            if time2<0:
            	#vals.update({'state': 'done'})
            	cr.execute('update survey_user_input set time_elapsed=%s where id=%s'% (0.0, user_input.id))
                #cr.execute('update survey_survey set t1=%s where id=%s'%(0.0,user_input.survey_id))
            	#_logger.critical('\n\n ---------- redirect time2---------------')
            	#_logger.critical(' \n -------- json.dumps(ret)---------%s \n\n ',json.dumps(ret))
            	#_logger.critical('----------user_input.state= %s \n',user_input.state)
            	#return request.website.render('survey.sfinished', {'survey': survey,'user_input': user_input})
        #_logger.critical(' \n -------- json.dumps(ret)---------%s \n\n ',json.dumps(ret))
        #_logger.critical(' \n *********** vals[state]************%s \n\n ',vals['state'])

        ret['state']=vals['state']
        return json.dumps(ret)

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