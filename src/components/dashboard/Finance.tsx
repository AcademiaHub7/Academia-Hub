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
  
  // États pour le filtrage des frais
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [showCustomFees, setShowCustomFees] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

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
    {
      id: 'FEE-001',
      name: 'Frais d\'inscription',
      type: 'inscription',
      amount: 380,
      isAnnual: true,
      isCustomizable: false,
      description: 'Frais d\'inscription annuel'
    },
    {
      id: 'FEE-002',
      name: 'Frais de réinscription',
      type: 'reinscription',
      amount: 250,
      isAnnual: true,
      isCustomizable: false,
      description: 'Frais de réinscription annuel'
    },
    {
      id: 'FEE-003',
      name: 'Frais de scolarité',
      type: 'scolarite',
      amount: 450,
      isAnnual: true,
      isCustomizable: true,
      description: 'Frais de scolarité par trimestre',
      paymentSchedule: {
        periods: [
          { id: 'P1', name: 'Trimestre 1', percentage: 33.33 },
          { id: 'P2', name: 'Trimestre 2', percentage: 33.33 },
          { id: 'P3', name: 'Trimestre 3', percentage: 33.34 }
        ]
      }
    },
    {
      id: 'FEE-004',
      name: 'Frais de cantine',
      type: 'cantine',
      amount: 520,
      isAnnual: true,
      isCustomizable: true,
      description: 'Frais de cantine mensuel'
    }
  ];

  // Données fictives pour les niveaux d'éducation (pour les modals)
  const educationLevels = [
    {
      id: 'MAT',
      name: 'Maternelle',
      classes: [
        { id: 'PS', name: 'Petite Section' },
        { id: 'MS', name: 'Moyenne Section' },
        { id: 'GS', name: 'Grande Section' }
      ]
    },
    {
      id: 'PRI',
      name: 'Primaire',
      classes: [
        { id: 'CI', name: 'CI' },
        { id: 'CP', name: 'CP' },
        { id: 'CE1', name: 'CE1' },
        { id: 'CE2', name: 'CE2' },
        { id: 'CM1', name: 'CM1' },
        { id: 'CM2', name: 'CM2' }
      ]
    },
    {
      id: 'SEC',
      name: 'Secondaire',
      classes: [
        { id: '6EME', name: '6ème' },
        { id: '5EME', name: '5ème' },
        { id: '4EME', name: '4ème' },
        { id: '3EME', name: '3ème' },
        { id: '2ND', name: '2nde' },
        { id: '1ERE', name: '1ère' },
        { id: 'TLE', name: 'Terminale' }
      ]
    }
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
              { id: 'reports', label: 'Rapports', icon: FileText },
              { id: 'fees', label: 'Paramètrage frais', icon: FileText },
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

          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Configuration des frais</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleNewFeeType}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Nouveau type de frais
                  </button>
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Gestion des échéances
                  </button>
                </div>
              </div>
              
              {/* Filtres et année scolaire */}
              <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <label htmlFor="school-year" className="block text-sm font-medium text-gray-700">Année scolaire</label>
                  <select
                    id="school-year"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    title="Sélectionner l'année scolaire"
                    aria-label="Sélectionner l'année scolaire"
                  >
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Type de frais</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <button 
                      className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded ${selectedFeeType === '' ? 'bg-blue-100 border-blue-500 text-blue-800' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                      onClick={() => setSelectedFeeType('')}
                    >
                      Tous
                    </button>
                    {feeTypes.map(fee => (
                      <button 
                        key={fee.id}
                        className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded ${selectedFeeType === fee.id ? 'bg-blue-100 border-blue-500 text-blue-800' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                        onClick={() => setSelectedFeeType(fee.id)}
                      >
                        {fee.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="custom-fees"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={showCustomFees}
                    onChange={(e) => setShowCustomFees(e.target.checked)}
                  />
                  <label htmlFor="custom-fees" className="ml-2 block text-sm text-gray-700">
                    Frais personnalisés
                  </label>
                </div>
              </div>
              
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Par niveau</h4>
                    <select
                      className="mt-1 block w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                      title="Filtrer par niveau d'éducation"
                      aria-label="Filtrer par niveau d'éducation"
                    >
                      <option value="">Tous les niveaux</option>
                      {educationLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-6">
                    {educationLevels
                      .filter(level => !levelFilter || level.id === levelFilter)
                      .map(level => (
                      <div key={level.id} className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-900">{level.name}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {level.classes.map(cls => (
                            <div key={cls.id} className="bg-white rounded-lg shadow">
                              <div className="p-4">
                                <h6 className="text-sm font-medium text-gray-900">{cls.name}</h6>
                                <div className="mt-2 space-y-2">
                                  {feeTypes
                                    .filter(feeType => !selectedFeeType || feeType.id === selectedFeeType)
                                    .map(feeType => (
                                    <div key={feeType.id} className="flex justify-between items-center">
                                      <div>
                                        <span className="text-sm font-medium text-gray-700">{feeType.name}</span>
                                        <span className="ml-2 text-xs text-gray-500">{feeType.amount} €</span>
                                      </div>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => handleEditItem({ ...feeType, classId: cls.id }, 'feeType')}
                                          className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                          Modifier
                                        </button>
                                        <button
                                          onClick={() => handleDeleteItem(feeType, 'feeType')}
                                          className="text-sm text-red-600 hover:text-red-800"
                                        >
                                          Supprimer
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Section pour les frais personnalisés */}
              {showCustomFees && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md mt-6">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Frais personnalisés par élève</h4>
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter frais personnalisé
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de frais</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raison</th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Marie Dubois</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3ème A</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Frais de scolarité</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">400 €</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bourse partielle</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-800 mr-4">Modifier</button>
                              <button className="text-red-600 hover:text-red-800">Supprimer</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pierre Martin</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2nde B</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Frais de cantine</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0 €</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Exonération sociale</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-800 mr-4">Modifier</button>
                              <button className="text-red-600 hover:text-red-800">Supprimer</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
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

      {/* Modal de gestion des échéances */}
      <div className={`fixed inset-0 z-50 overflow-y-auto ${showScheduleModal ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Gestion des échéances de paiement
                  </h3>
                  <div className="mt-6">
                    <div className="bg-blue-50 p-4 rounded-md mb-6">
                      <p className="text-sm text-blue-700">Définissez les périodes de paiement et leur répartition pour les frais de scolarité.</p>
                    </div>
                    
                    <form id="schedule-form" className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frais de scolarité - {selectedYear}</label>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pourcentage</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date limite</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Trimestre 1</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input type="number" className="w-20 rounded-md border-gray-300" defaultValue="33.33" min="0" max="100" step="0.01" />
                                  <span className="ml-1 text-gray-500">%</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input type="date" className="rounded-md border-gray-300" defaultValue="2024-10-15" />
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Trimestre 2</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input type="number" className="w-20 rounded-md border-gray-300" defaultValue="33.33" min="0" max="100" step="0.01" />
                                  <span className="ml-1 text-gray-500">%</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input type="date" className="rounded-md border-gray-300" defaultValue="2025-01-15" />
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Trimestre 3</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input type="number" className="w-20 rounded-md border-gray-300" defaultValue="33.34" min="0" max="100" step="0.01" />
                                  <span className="ml-1 text-gray-500">%</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input type="date" className="rounded-md border-gray-300" defaultValue="2025-04-15" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowScheduleModal(false)}
              >
                Enregistrer
              </button>
              <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowScheduleModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;