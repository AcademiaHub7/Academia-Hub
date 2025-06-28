/**
 * Contrôleur pour la gestion de l'authentification
 * @module controllers/AuthController
 */

import type { Request, Response } from 'express';
import { User } from '../models/User';
import School from '../models/School';
import { SchoolStatus, UserRole } from '../types/common';

import jwt from 'jsonwebtoken';
import { userService } from '../services/user/userService';
// Import commenté car non utilisé pour l'instant
// import { emailService } from '../services/email/emailService';

/**
 * Contrôleur pour gérer l'authentification des utilisateurs
 */
export class AuthController {
  /**
   * Authentifie un utilisateur avec email et mot de passe
   * Prend en compte le sous-domaine pour identifier l'école
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        });
      }
      
      // Si un sous-domaine est présent, vérifier l'école
      if (req.subdomain) {
        const school = await School.findBySubdomain(req.subdomain);
        
        if (!school) {
          return res.status(404).json({
            success: false,
            message: 'École non trouvée'
          });
        }
        
        // Vérifier le statut de l'école
        if (school.status !== SchoolStatus.ACTIVE) {
          return res.status(403).json({
            success: false,
            message: 'Cette école n\'est pas active',
            status: school.status
          });
        }
        
        // Vérifier si l'école a passé la vérification KYC
        if (!school.isKycVerified()) {
          return res.status(403).json({
            success: false,
            message: 'La vérification KYC de cette école n\'est pas complète',
            kyc_status: school.kyc_status
          });
        }
        
        // Vérifier si l'école a un abonnement actif
        const hasActiveSubscription = await school.hasActiveSubscription();
        if (!hasActiveSubscription) {
          return res.status(403).json({
            success: false,
            message: 'L\'abonnement de cette école a expiré'
          });
        }
        
        // Vérifier si l'utilisateur existe pour cette école
        const users = await userService.listUsersByTenant(school.id, 1, 1);
        const user = users.data.find(u => u.email === email);
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Identifiants invalides'
          });
        }
        
        // Vérifier le mot de passe
        const isPasswordValid = await userService.verifyUserPassword(user.id, password);
        
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Identifiants invalides'
          });
        }
        
        // Vérifier si l'utilisateur est actif
        if (user.status !== 'active') {
          return res.status(403).json({
            success: false,
            message: 'Compte utilisateur inactif'
          });
        }
        
        // Générer le token JWT
        const token = jwt.sign(
          { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            tenant_id: user.tenant_id
          },
          process.env.JWT_SECRET || 'default_secret',
          { expiresIn: '24h' }
        );
        
        // Récupérer les permissions de l'utilisateur
        const permissions = await userService.getUserPermissions(user.id);
        
        return res.status(200).json({
          success: true,
          message: 'Connexion réussie',
          token,
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            tenant_id: user.tenant_id,
            permissions
          },
          school: {
            id: school.id,
            name: school.name,
            subdomain: school.subdomain
          }
        });
      } else {
        // Connexion sans sous-domaine (pour les promoteurs)
        const user = await User.findByEmail(email);
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Identifiants invalides'
          });
        }
        
        // Vérifier le mot de passe
        const isPasswordValid = await userService.verifyUserPassword(user.id, password);
        
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Identifiants invalides'
          });
        }
        
        // Vérifier si l'utilisateur est actif
        if (user.status !== 'active') {
          return res.status(403).json({
            success: false,
            message: 'Compte utilisateur inactif'
          });
        }
        
        // Vérifier si l'utilisateur est un promoteur ou un admin
        if (user.role !== UserRole.PROMOTER && user.role !== UserRole.ADMIN) {
          return res.status(403).json({
            success: false,
            message: 'Veuillez vous connecter via le sous-domaine de votre école'
          });
        }
        
        // Si c'est un promoteur, récupérer son école
        const school = await School.findById(user.tenant_id);
        
        if (!school && user.role !== UserRole.ADMIN) {
          return res.status(404).json({
            success: false,
            message: 'École non trouvée'
          });
        }
        
        // Générer le token JWT
        const token = jwt.sign(
          { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            tenant_id: user.tenant_id
          },
          process.env.JWT_SECRET || 'default_secret',
          { expiresIn: '24h' }
        );
        
        // Récupérer les permissions de l'utilisateur
        const permissions = await userService.getUserPermissions(user.id);
        
        return res.status(200).json({
          success: true,
          message: 'Connexion réussie',
          token,
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            tenant_id: user.tenant_id,
            permissions
          },
          school: school ? {
            id: school.id,
            name: school.name,
            subdomain: school.subdomain,
            status: school.status,
            kyc_status: school.kyc_status
          } : null
        });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  }

  /**
   * Déconnecte l'utilisateur actuel
   */
  static async logout(_req: Request, res: Response) {
    // Note: La déconnexion côté serveur n'est pas nécessaire avec JWT
    // Le client doit simplement supprimer le token
    
    return res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  static async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }
      
      // Récupérer l'école de l'utilisateur
      const school = req.user.tenant_id ? await School.findById(req.user.tenant_id) : null;
      
      // Récupérer les permissions de l'utilisateur
      const permissions: string[] = []; // À implémenter: récupérer les permissions depuis le service utilisateur
      
      return res.status(200).json({
        success: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          role: req.user.role,
          tenant_id: req.user.tenant_id,
          permissions
        },
        school: school ? {
          id: school.id,
          name: school.name,
          subdomain: school.subdomain,
          status: school.status
        } : null
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur'
      });
    }
  }

  /**
   * Envoie un email pour réinitialiser le mot de passe
   */
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requis'
        });
      }
      
      // Si un sous-domaine est présent, chercher l'utilisateur dans cette école
      let user = null;
      let school = null;
      
      if (req.subdomain) {
        school = await School.findBySubdomain(req.subdomain);
        
        if (!school) {
          // Ne pas révéler que l'école n'existe pas
          return res.status(200).json({
            success: true,
            message: 'Si cette adresse email est associée à un compte, un email de réinitialisation sera envoyé'
          });
        }
        
        // Récupérer l'utilisateur par email pour ce tenant
        try {
          const users = await userService.listUsersByTenant(school.id, 1, 1);
          user = users.data.find(u => u.email === email) || null;
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          // Continuer avec user = null
        }
      } else {
        // Si pas de sous-domaine, essayer de trouver l'utilisateur par email
        try {
          user = await userService.getUserByEmail(email);
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur par email:', error);
          // Continuer avec user = null
        }
      }
      
      if (!user) {
        // Ne pas révéler que l'utilisateur n'existe pas
        return res.status(200).json({
          success: true,
          message: 'Si cette adresse email est associée à un compte, un email de réinitialisation sera envoyé'
        });
      }
      
      // Si on n'a pas encore l'école, la récupérer
      if (!school && user.tenant_id) {
        school = await School.findById(user.tenant_id);
      }
      
      // Générer un token de réinitialisation
      /* 
      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'votre_secret_jwt',
        { expiresIn: '1h' }
      );
      */
      
      // Construire l'URL de réinitialisation
      // Cette URL sera utilisée quand le service d'email sera implémenté
      /* 
      const resetUrl = school?.subdomain 
        ? `https://${school.subdomain}.academiahub.com/reset-password?token=${resetToken}`
        : `https://academiahub.com/reset-password?token=${resetToken}`;
      */

      // Envoyer l'email de réinitialisation
      // Note: L'implémentation de l'envoi d'email est commentée car le service email n'est pas encore implémenté
      // Une fois le service email implémenté, décommentez la ligne ci-dessous
      // et assurez-vous que l'import emailService est correctement configuré
      /*
      try {
        await emailService.sendPasswordResetEmail(user.email, {
          resetUrl,
          firstName: user.first_name,
          schoolName: school?.name || 'Academia Hub'
        });
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', emailError);
        // Ne pas échouer la requête si l'email ne peut pas être envoyé
      }
      */
      
      return res.status(200).json({
        success: true,
        message: 'Si cette adresse email est associée à un compte, un email de réinitialisation sera envoyé'
      });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation du mot de passe:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement de la demande de réinitialisation du mot de passe'
      });
    }
  }

  /**
   * Change le mot de passe de l'utilisateur connecté
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Mot de passe actuel et nouveau mot de passe requis'
        });
      }
      
      // Vérifier le mot de passe actuel
      const isPasswordValid = await userService.verifyUserPassword(req.user.id, currentPassword);
      
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Mot de passe actuel incorrect'
        });
      }
      
      // Mettre à jour le mot de passe
      await userService.updateUserPassword(req.user.id, newPassword);
      
      return res.status(200).json({
        success: true,
        message: 'Mot de passe changé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du changement de mot de passe'
      });
    }
  }

  /**
   * Vérifie si un token JWT est valide
   */
  static async verifyToken(req: Request, res: Response) {
    try {
      // Si l'utilisateur est présent dans req, le token est valide
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Token valide',
        user_id: req.user.id
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du token'
      });
    }
  }

  /**
   * Redirige l'utilisateur vers la page appropriée après connexion
   * en fonction de son rôle et du statut de l'école
   */
  static async redirectAfterLogin(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }
      
      // Récupérer l'école de l'utilisateur
      const school = req.user.tenant_id ? await School.findById(req.user.tenant_id) : null;
      let redirectUrl = '/dashboard';
      
      // Vérifier si l'utilisateur est un promoteur et a une école
      if (req.user.role === UserRole.PROMOTER && school) {
        // Redirection spécifique pour le promoteur en fonction du statut de l'école
        switch (school.status) {
          case SchoolStatus.PENDING_KYC:
            redirectUrl = '/school/kyc-verification';
            break;
          case SchoolStatus.PENDING_PAYMENT:
            redirectUrl = '/school/subscription';
            break;
          case SchoolStatus.SUSPENDED:
            redirectUrl = '/school/suspended';
            break;
          default:
            redirectUrl = '/school/dashboard';
        }
      } else {
        // Redirection en fonction du rôle de l'utilisateur
        switch (req.user.role) {
          case UserRole.ADMIN:
            redirectUrl = '/admin/dashboard';
            break;
          case UserRole.TEACHER:
            redirectUrl = '/teacher/dashboard';
            break;
          case UserRole.STAFF:
            redirectUrl = '/staff/dashboard';
            break;
          case UserRole.STUDENT:
            redirectUrl = '/student/dashboard';
            break;
          case UserRole.PARENT:
            redirectUrl = '/parent/dashboard';
            break;
          case UserRole.PROMOTER:
            redirectUrl = '/promoter/dashboard';
            break;
          default:
            redirectUrl = '/dashboard';
        }
      }
      
      return res.status(200).json({
        success: true,
        redirect_url: redirectUrl
      });
    } catch (error) {
      console.error('Erreur lors de la redirection après connexion:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la redirection après connexion'
      });
    }
  }
}

export default AuthController;
