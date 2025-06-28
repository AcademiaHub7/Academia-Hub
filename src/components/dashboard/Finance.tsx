import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Receipt,
  FileText,
  Calculator,
  Wallet,
  UserCheck,
  BarChart3
} from 'lucide-react';
import { 
  InvoiceModal, 
  ExpenseModal, 
  FeeTypeModal, 
  ClosingDayModal, 
  BudgetModal,
  ConfirmModal,
  AlertModal
} from '../modals';

import './Finance.css';

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFeeTypeModalOpen, setIsFeeTypeModalOpen] = useState(false);
  const [isClosingDayModalOpen, setIsClosingDayModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });

  // Selected item for edit/delete
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'edit' | ''>('');

  const financialStats = [
    {
      title: 'Revenus du mois',
      value: '€45,230',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Paiements en attente',
      value: '€8,450',
      change: '-5%',
      trend: 'down',
      icon: Clock,
      color: 'from-yellow-600 to-yellow-700'
    },
    {
      title: 'Frais collectés',
      value: '€127,890',
      change: '+8%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Élèves à jour',
      value: '1,189',
      change: '+3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-purple-600 to-purple-700'
    }
  ];

  const recentPayments = [
    {
      id: 'REC-2024-000123',
      studentName: 'Marie Dubois',
      class: '3ème A',
      amount: 450,
      date: '2024-01-10',
      method: 'Carte bancaire',
      status: 'completed',
      type: 'Frais de scolarité'
    },
    {
      id: 'REC-2024-000124',
      studentName: 'Pierre Martin',
      class: '2nde B',
      amount: 380,
      date: '2024-01-09',
      method: 'Mobile Money',
      status: 'completed',
      type: 'Frais d\'inscription'
    },
    {
      id: 'REC-2024-000125',
      studentName: 'Sophie Lambert',
      class: '1ère C',
      amount: 520,
      date: '2024-01-08',
      method: 'Virement bancaire',
      status: 'pending',
      type: 'Frais de cantine'
    }
  ];

  const pendingFees = [
    {
      studentName: 'Jean Dupont',
      class: 'Terminale S',
      amount: 650,
      dueDate: '2024-01-15',
      daysOverdue: 0,
      parentPhone: '06 12 34 56 78',
      type: 'Frais de scolarité'
    },
    {
      studentName: 'Emma Rodriguez',
      class: '4ème B',
      amount: 420,
      dueDate: '2024-01-05',
      daysOverdue: 5,
      parentPhone: '06 98 76 54 32',
      type: 'Frais d\'examen'
    },
    {
      studentName: 'Lucas Bernard',
      class: '5ème A',
      amount: 380,
      dueDate: '2023-12-20',
      daysOverdue: 21,
      parentPhone: '06 55 66 77 88',
      type: 'Frais de transport'
    }
  ];

  const expenses = [
    {
      id: 'DEP-2024-000045',
      description: 'Salaires enseignants',
      category: 'Personnel',
      amount: 15420,
      date: '2024-01-10',
      status: 'approved',
      approvedBy: 'Directeur'
    },
    {
      id: 'DEP-2024-000046',
      description: 'Fournitures scolaires',
      category: 'Matériel',
      amount: 2340,
      date: '2024-01-09',
      status: 'pending',
      approvedBy: null
    },
    {
      id: 'DEP-2024-000047',
      description: 'Maintenance informatique',
      category: 'Maintenance',
      amount: 890,
      date: '2024-01-08',
      status: 'approved',
      approvedBy: 'Responsable IT'
    }
  ];

  const dailyClosing = {
    date: '2024-01-10',
    totalIncome: 4250,
    totalExpenses: 1890,
    netBalance: 2360,
    cashBalance: 1200,
    bankBalance: 45230,
    status: 'open'
  };

  const treasuryData = {
    currentBalance: 46430,
    monthlyIncome: 45230,
    monthlyExpenses: 38970,
    cashFlow: 6260,
    projectedBalance: 52690
  };

  // Données fictives pour les élèves (pour les modals)
  const students = [
    { id: 'STD-001', firstName: 'Marie', lastName: 'Dubois', class: '3ème A' },
    { id: 'STD-002', firstName: 'Pierre', lastName: 'Martin', class: '2nde B' },
    { id: 'STD-003', firstName: 'Sophie', lastName: 'Lambert', class: '1ère C' }
  ];

  // Données fictives pour les types de frais (pour les modals)
  const feeTypes = [
    { id: 'FEE-001', name: 'Frais de scolarité', amount: 450 },
    { id: 'FEE-002', name: 'Frais d\'inscription', amount: 380 },
    { id: 'FEE-003', name: 'Frais de cantine', amount: 520 }
  ];

  // Données fictives pour les niveaux d'éducation (pour les modals)
  const educationLevels = [
    { id: 'LVL-001', name: 'Primaire' },
    { id: 'LVL-002', name: 'Collège' },
    { id: 'LVL-003', name: 'Lycée' }
  ];

  // Données fictives pour les classes (pour les modals)
  const classes = [
    { id: 'CLS-001', name: '3ème A' },
    { id: 'CLS-002', name: '2nde B' },
    { id: 'CLS-003', name: '1ère C' }
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpenseStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverdueColor = (days: number) => {
    if (days === 0) return 'text-green-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handlers pour les modals
  const handleNewPayment = () => {
    setSelectedItem(null);
    setIsPaymentModalOpen(true);
  };

  const handleNewInvoice = () => {
    setSelectedItem(null);
    setIsInvoiceModalOpen(true);
  };

  const handleNewExpense = () => {
    setSelectedItem(null);
    setIsExpenseModalOpen(true);
  };

  const handleNewFeeType = () => {
    setSelectedItem(null);
    setIsFeeTypeModalOpen(true);
  };

  const handleClosingDay = () => {
    setIsClosingDayModalOpen(true);
  };

  const handleNewBudget = () => {
    setSelectedItem(null);
    setIsBudgetModalOpen(true);
  };

  const handleEditItem = (item: Record<string, unknown>, type: 'payment' | 'invoice' | 'expense' | 'feeType' | 'closingDay' | 'budget') => {
    setSelectedItem(item);
    setActionType('edit');
    
    switch (type) {
      case 'invoice':
        setIsInvoiceModalOpen(true);
        break;
      case 'expense':
        setIsExpenseModalOpen(true);
        break;
      case 'feeType':
        setIsFeeTypeModalOpen(true);
        break;
      case 'closingDay':
        setIsClosingDayModalOpen(true);
        break;
      case 'budget':
        setIsBudgetModalOpen(true);
        break;
      default:
        // Handle payment case or other types
        if (type === 'payment') {
          alert('Fonctionnalité de paiement en cours de développement');
        }
        break;
    }
  };

  const handleDeleteItem = (item: Record<string, unknown>, type: 'payment' | 'invoice' | 'expense' | 'feeType' | 'closingDay' | 'budget') => {
    setSelectedItem(item);
    setActionType('delete');
    
    // Set confirmation message based on type
    let message = '';
    const itemId = item.id ? String(item.id) : '';
    
    switch (type) {
      case 'payment':
        message = `Êtes-vous sûr de vouloir supprimer le paiement ${itemId} ?`;
        break;
      case 'invoice':
        message = `Êtes-vous sûr de vouloir supprimer la facture ${itemId} ?`;
        break;
      case 'expense':
        message = `Êtes-vous sûr de vouloir supprimer la dépense ${itemId} ?`;
        break;
      default:
        message = 'Êtes-vous sûr de vouloir supprimer cet élément ?';
    }
    
    setConfirmMessage({
      title: 'Confirmer la suppression',
      message: message,
      type: 'delete' as const
    });
    
    setIsConfirmModalOpen(true);
  };


  const handleSaveInvoice = (invoiceData: Record<string, unknown>) => {
    console.log('Saving invoice:', invoiceData);
    setAlertMessage({
      title: 'Facture enregistrée',
      message: 'La facture a été enregistrée avec succès.',
      type: 'success' as const
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveExpense = (expenseData: Record<string, unknown>) => {
    console.log('Saving expense:', expenseData);
    setAlertMessage({
      title: 'Dépense enregistrée',
      message: 'La dépense a été enregistrée avec succès.',
      type: 'success' as const
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveFeeType = (feeTypeData: Record<string, unknown>) => {
    console.log('Saving fee type:', feeTypeData);
    setAlertMessage({
      title: 'Type de frais enregistré',
      message: 'Le type de frais a été enregistré avec succès.',
      type: 'success' as const
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveClosingDay = (closingData: Record<string, unknown>) => {
    console.log('Saving closing day:', closingData);
    setAlertMessage({
      title: 'Journée clôturée',
      message: 'La journée a été clôturée avec succès.',
      type: 'success' as const
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveBudget = (budgetData: Record<string, unknown>) => {
    console.log('Saving budget:', budgetData);
    setAlertMessage({
      title: 'Budget enregistré',
      message: 'Le budget a été enregistré avec succès.',
      type: 'success' as const
    });
    setIsAlertModalOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting item:', selectedItem);
    setIsConfirmModalOpen(false);
    setAlertMessage({
      title: 'Élément supprimé',
      message: 'L\'élément a été supprimé avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Économat & Finance</h1>
          <p className="text-gray-600">Gestion financière complète et contrôle budgétaire</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
          <button 
            onClick={handleNewPayment}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel encaissement
          </button>
        </div>
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'payments', label: 'Encaissements', icon: CreditCard },
              { id: 'pending', label: 'Frais en attente', icon: Clock },
              { id: 'expenses', label: 'Dépenses', icon: Receipt },
              { id: 'closing', label: 'Clôture journée', icon: Calculator },
              { id: 'treasury', label: 'Trésorerie', icon: Wallet },
              { id: 'hr', label: 'RH & Paie', icon: UserCheck },
              { id: 'reports', label: 'Rapports', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Dashboard temps réel */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Encaissements aujourd'hui</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de scolarité</span>
                      <span className="font-bold text-blue-600">€2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais d'examen</span>
                      <span className="font-bold text-green-600">€890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cantine</span>
                      <span className="font-bold text-purple-600">€320</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">€3,660</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Méthodes de paiement</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Carte bancaire</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mobile Money</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-600 h-2 rounded-full w-1/5"></div>
                        </div>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Virement</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-purple-600 h-2 rounded-full w-1/20"></div>
                        </div>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={handleNewPayment}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <DollarSign className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-700 group-hover:text-blue-700">Nouvel encaissement</p>
                </button>
                <button 
                  onClick={handleNewExpense}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <Receipt className="w-8 h-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-700 group-hover:text-green-700">Nouvelle dépense</p>
                </button>
                <button 
                  onClick={handleNewBudget}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <FileText className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-700 group-hover:text-purple-700">Générer rapport</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Système d'encaissement</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </button>
                  <button 
                    onClick={handleNewInvoice}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle facture
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reçu N°
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type de frais
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Méthode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                            <div className="text-sm text-gray-500">{payment.class}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          €{payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status === 'completed' ? 'Terminé' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Reçu
                          </button>
                          <button 
                            onClick={() => handleEditItem(payment, 'payment')}
                            className="text-gray-600 hover:text-gray-900 mr-3"
                          >
                            Éditer
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(payment, 'payment')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">État des paiements - Frais en attente</h3>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Envoyer rappels
                  </button>
                  <button 
                    onClick={handleNewFeeType}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau type de frais
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {pendingFees.map((fee, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{fee.studentName}</h4>
                          <p className="text-sm text-gray-600">{fee.class} • {fee.type}</p>
                          <p className="text-sm text-gray-500">Échéance: {fee.dueDate}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">€{fee.amount}</p>
                        <p className={`text-sm font-medium ${getOverdueColor(fee.daysOverdue)}`}>
                          {fee.daysOverdue === 0 ? 'À échéance' : `${fee.daysOverdue} jours de retard`}
                        </p>
                        <p className="text-sm text-gray-500">{fee.parentPhone}</p>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                          Contacter
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                          Échéancier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestion des dépenses</h3>
                <button 
                  onClick={handleNewExpense}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle dépense
                </button>
              </div>

              <div className="grid gap-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{expense.description}</h4>
                          <p className="text-sm text-gray-600">{expense.category} • {expense.id}</p>
                          <p className="text-sm text-gray-500">{expense.date}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-600">-€{expense.amount}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExpenseStatusColor(expense.status)}`}>
                          {expense.status === 'approved' ? 'Approuvé' : 
                           expense.status === 'pending' ? 'En attente' : 'Rejeté'}
                        </span>
                        {expense.approvedBy && (
                          <p className="text-sm text-gray-500">Par: {expense.approvedBy}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">
                          Voir justificatif
                        </button>
                        {expense.status === 'pending' && (
                          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm">
                            Approuver
                          </button>
                        )}
                        <button 
                          onClick={() => handleEditItem(expense, 'expense')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                        >
                          Éditer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'closing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Clôture de journée</h3>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Réconciliation
                  </button>
                  <button 
                    onClick={handleClosingDay}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Clôturer la journée
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Bilan du {dailyClosing.date}</h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total encaissements</span>
                      <span className="text-xl font-bold text-green-600">+€{dailyClosing.totalIncome}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total dépenses</span>
                      <span className="text-xl font-bold text-red-600">-€{dailyClosing.totalExpenses}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-medium">Solde net</span>
                      <span className="text-2xl font-bold text-blue-600">€{dailyClosing.netBalance}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Caisse physique</span>
                      <span className="font-bold">€{dailyClosing.cashBalance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Solde bancaire</span>
                      <span className="font-bold">€{dailyClosing.bankBalance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Statut</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dailyClosing.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {dailyClosing.status === 'open' ? 'Ouvert' : 'Clôturé'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'treasury' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestion de trésorerie</h3>
                <button 
                  onClick={handleNewBudget}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau budget
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">État de la trésorerie</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Solde actuel</span>
                      <span className="text-2xl font-bold text-purple-600">€{treasuryData.currentBalance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenus mensuels</span>
                      <span className="font-bold text-green-600">+€{treasuryData.monthlyIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dépenses mensuelles</span>
                      <span className="font-bold text-red-600">-€{treasuryData.monthlyExpenses}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Cash-flow</span>
                      <span className="text-xl font-bold text-blue-600">€{treasuryData.cashFlow}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6 border border-green-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Prévisions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Solde projeté (30j)</span>
                      <span className="text-xl font-bold text-green-600">€{treasuryData.projectedBalance}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>• Rentrées prévues: €12,450</p>
                      <p>• Sorties prévues: €8,190</p>
                      <p>• Échéances importantes: 3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hr' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Personnel & RH - Gestion de la paie</h3>
                <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Calculer paie
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Masse salariale</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salaires bruts</span>
                      <span className="font-bold">€45,230</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Charges sociales</span>
                      <span className="font-bold text-red-600">€13,569</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Primes</span>
                      <span className="font-bold text-green-600">€2,340</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold">€61,139</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Impôts et taxes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVA à payer</span>
                      <span className="font-bold">€8,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impôt sur sociétés</span>
                      <span className="font-bold">€3,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxe professionnelle</span>
                      <span className="font-bold">€1,890</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold text-red-600">€13,540</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Personnel actif</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enseignants</span>
                      <span className="font-bold">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Administration</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Personnel technique</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold">65</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Rapports financiers avancés</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleNewBudget}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Budget prévisionnel
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Bilan comptable
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Rapports disponibles</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Compte de résultat</span>
                        <span className="text-sm text-gray-500">Mensuel</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Bilan comptable</span>
                        <span className="text-sm text-gray-500">Annuel</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Analyse des créances</span>
                        <span className="text-sm text-gray-500">Temps réel</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Suivi budgétaire</span>
                        <span className="text-sm text-gray-500">Trimestriel</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Indicateurs clés</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Taux de recouvrement</span>
                        <span className="text-sm font-medium">94.2%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill green"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Exécution budgétaire</span>
                        <span className="text-sm font-medium">78.5%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill blue"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Marge opérationnelle</span>
                        <span className="text-sm font-medium">15.8%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill orange-small"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        invoiceData={actionType === 'edit' ? selectedItem : undefined}
        isEdit={actionType === 'edit'}
        students={students}
        feeTypes={feeTypes}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        expenseData={actionType === 'edit' ? selectedItem : undefined}
        isEdit={actionType === 'edit'}
      />

      <FeeTypeModal
        isOpen={isFeeTypeModalOpen}
        onClose={() => setIsFeeTypeModalOpen(false)}
        onSave={handleSaveFeeType}
        feeTypeData={actionType === 'edit' ? selectedItem : undefined}
        isEdit={actionType === 'edit'}
        educationLevels={educationLevels}
        classes={classes}
      />

      <ClosingDayModal
        isOpen={isClosingDayModalOpen}
        onClose={() => setIsClosingDayModalOpen(false)}
        onSave={handleSaveClosingDay}
        closingData={dailyClosing}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        budgetData={actionType === 'edit' ? selectedItem : undefined}
        isEdit={actionType === 'edit'}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`}
        type="danger"
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title={alertMessage.title}
        message={alertMessage.message}
        type={alertMessage.type}
      />
    </div>
  );
};

export default Finance;