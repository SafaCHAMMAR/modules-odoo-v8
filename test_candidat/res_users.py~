from openerp.osv import osv, fields
from openerp.tools.translate import _
from openerp.addons import auth_signup
#from auth_signup import res_users
import logging

_logger = logging.getLogger(__name__)

class res_users(osv.Model):
	_inherit='res.users'
	def signup(self, cr, uid, values, token=None, context=None):
		""" signup a user, to either:
		- create a new user (no token), or
		- create a user for a partner (with token, but no user for partner), or
		- change the password of a user (with token, and existing user).
		:param values: a dictionary with field values that are written on user
		:param token: signup token (optional)
		:return: (dbname, login, password) for the signed up user
	    """
		if context is None:
			context={}
		if token:
			res_partner = self.pool.get('res.partner')
			partner = res_partner._signup_retrieve_partner(
						cr, uid, token, check_validity=True, raise_exception=True, context=None)
			partner_user = partner.user_ids and partner.user_ids[0] or False
			if not partner_user:
				values['candidat'] =True
		else:
			values['candidat'] = True
			_logger.info('WEBKUL OVERRIDEN METOD____%r',values)
		return super(res_users, self).signup(cr, uid, values, token, context=context)
