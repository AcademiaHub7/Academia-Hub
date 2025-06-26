import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Upload,
  FileText,
  Users,
  Calendar,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  Building,
  UserCheck,
  Briefcase,
  Calculator
} from 'lucide-react';
import { 
  PayrollModal, 
  PayrollBatchModal, 
  PayrollReportModal, 
  PayrollDeclarationModal, 
  PayrollSettingsModal,
  ConfirmModal,
  AlertModal
} from '../modals';

const PayrollManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payslips');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedEmployeeType, setSelectedEmployeeType] = useState('all');
  
  // Modals state
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isPayrollBatchModalOpen, setIsPayrollBatchModalOpen] = useState(false);
  const [isPayrollReportModalOpen, setIsPayrollReportModalOpen] = useState(false);
  const [isPayrollDeclarationModalOpen, setIsPayrollDeclarationModalOpen] = useState(false);
  const [isPayrollSettingsModalOpen, setIsPayrollSettingsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Statistiques de paie
  const payrollStats = [
    {
      title: 'Masse salariale mensuelle',
      value: '15.678.000 F CFA',
      change: '+2,1%',
      icon: DollarSign,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Employés actifs',
      value: '65',
      change: '+3',
      icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Charges sociales',
      value: '3.135.600 F CFA',
      change: '+2,1%',
      icon: Building,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Prochaine échéance',
      value: '15/02/2024',
      change: 'CNSS',
      icon: Calendar,
      color: 'from-orange-600 to-orange-700'
    }
  ];

  // Données fictives pour les bulletins de paie
  const payslips = [
    {
      id: 'PAY-2024-00001',
      employeeName: 'Marie Dubois',
      employeeId: 'EMP-001',
      employeeType: 'permanent',
      department: 'Enseignement',
      position: 'Professeur de Français',
      period: 'Janvier 2024',
      grossSalary: 350000,
      netSalary: 280000,
      paymentDate: '2024-01-25',
      paymentMethod: 'Virement bancaire',
      status: 'paid'
    },
    {
      id: 'PAY-2024-00002',
      employeeName: 'Pierre Martin',
      employeeId: 'EMP-002',
      employeeType: 'permanent',
      department: 'Administration',
      position: 'Comptable',
      period: 'Janvier 2024',
      grossSalary: 280000,
      netSalary: 224000,
      paymentDate: '2024-01-25',
      paymentMethod: 'Virement bancaire',
      status: 'paid'
    },
    {
      id: 'PAY-2024-00003',
      employeeName: 'Sophie Lambert',
      employeeId: 'EMP-003',
      employeeType: 'vacataire',
      department: 'Enseignement',
      position: 'Professeur d\'Anglais',
      period: 'Janvier 2024',
      grossSalary: 120000,
      netSalary: 96000,
      paymentDate: '2024-01-25',
      paymentMethod: 'Mobile Money',
      status: 'pending'
    }
  ];

  // Données fictives pour les déclarations
  const declarations = [
    {
      id: 'DEC-CNSS-2024-01',
      type: 'CNSS',
      period: 'Janvier 2024',
      dueDate: '2024-02-15',
      amount: 3135600,
      status: 'pending',
      submissionDate: null,
      paymentDate: null,
      reference: null
    },
    {
      id: 'DEC-IRPP-2024-01',
      type: 'IRPP',
      period: 'Janvier 2024',
      dueDate: '2024-02-10',
      amount: 1208000,
      status: 'pending',
      submissionDate: null,
      paymentDate: null,
      reference: null
    },
    {
      id: 'DEC-CNSS-2023-12',
      type: 'CNSS',
      period: 'Décembre 2023',
      dueDate: '2024-01-15',
      amount: 3072000,
      status: 'paid',
      submissionDate: '2024-01-12',
      paymentDate: '2024-01-12',
      reference: 'CNSS-REF-12345'
    }
  ];

  // Filtrage des bulletins de paie
  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = 
      payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedEmployeeType === 'all' || payslip.employeeType === selectedEmployeeType;
    
    // Pour la période, on pourrait ajouter une logique plus complexe
    // Ici on simplifie en supposant que 'current' correspond à Janvier 2024
    const matchesPeriod = selectedPeriod === 'all' || 
      (selectedPeriod === 'current' && payslip.period === 'Janvier 2024');
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDeclarationStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'late': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Formatage des montants en F CFA
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Handlers pour les modales
  const handleNewPayroll = () => {
    setIsEditMode(false);
    setSelectedPayroll(null);
    setIsPayrollModalOpen(true);
  };

  const handleEditPayroll = (payroll: any) => {
    setIsEditMode(true);
    setSelectedPayroll(payroll);
    setIsPayrollModalOpen(true);
  };

  const handleDeletePayroll = (payroll: any) => {
    setSelectedPayroll(payroll);
    setIsConfirmModalOpen(true);
  };

  const handleSavePayroll = (payrollData: any) => {
    console.log('Saving payroll:', payrollData);
    setIsAlertModalOpen(true);
  };

  const handleSaveBatch = (batchData: any) => {
    console.log('Processing batch:', batchData);
    setIsAlertModalOpen(true);
  };

  const handleGenerateReport = (reportOptions: any) => {
    console.log('Generating report with options:', reportOptions);
    setIsAlertModalOpen(true);
  };

  const handleGenerateDeclaration = (declarationOptions: any) => {
    console.log('Generating declaration with options:', declarationOptions);
    setIsAlertModalOpen(true);
  };

  const handleSaveSettings = (settings: any) => {
    console.log('Saving settings:', settings);
    setIsAlertModalOpen(true);
  };

  const confirmDeletePayroll = () => {
    console.log('Deleting payroll:', selectedPayroll);
    setIsConfirmModalOpen(false);
    setIsAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestion de la Paie</h1>
          <p className="text-gray-600 dark:text-gray-400">Traitement des salaires et déclarations sociales</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => setIsPayrollSettingsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </button>
          <button 
            onClick={handleNewPayroll}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle paie
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {payrollStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.change}</span>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setIsPayrollBatchModalOpen(true)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center"
        >
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">Traitement par lot</span>
        </button>
        
        <button 
          onClick={() => setIsPayrollReportModalOpen(true)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center"
        >
          <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">Rapports de paie</span>
        </button>
        
        <button 
          onClick={() => setIsPayrollDeclarationModalOpen(true)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center"
        >
          <Building className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">Déclarations sociales</span>
        </button>
        
        <button className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center">
          <Calculator className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">Simulateur de paie</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'payslips', label: 'Bulletins de paie', icon: FileText },
              { id: 'declarations', label: 'Déclarations sociales', icon: Building },
              { id: 'employees', label: 'Employés', icon: UserCheck },
              { id: 'history', label: 'Historique', icon: Clock },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
          {activeTab === 'payslips' && (
            <div className="space-y-6">
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Rechercher un employé..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="current">Période courante</option>
                    <option value="previous">Période précédente</option>
                    <option value="all">Toutes les périodes</option>
                  </select>
                  
                  <select
                    value={selectedEmployeeType}
                    onChange={(e) => setSelectedEmployeeType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">Tous les employés</option>
                    <option value="permanent">Personnel permanent</option>
                    <option value="vacataire">Personnel vacataire</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres avancés
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </button>
                </div>
              </div>

              {/* Payslips Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Employé
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Référence
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Période
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Salaire brut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Salaire net
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date de paiement
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPayslips.map((payslip) => (
                      <tr key={payslip.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {payslip.employeeName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {payslip.employeeName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {payslip.position}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {payslip.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {payslip.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatAmount(payslip.grossSalary)} F CFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                          {formatAmount(payslip.netSalary)} F CFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {payslip.paymentDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payslip.status)}`}>
                            {payslip.status === 'paid' ? 'Payé' : 
                             payslip.status === 'pending' ? 'En attente' : 'Annulé'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditPayroll(payslip)}
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePayroll(payslip)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'declarations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Déclarations sociales et fiscales</h3>
                <button 
                  onClick={() => setIsPayrollDeclarationModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle déclaration
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Référence
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Période
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Montant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date d'échéance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {declarations.map((declaration) => (
                      <tr key={declaration.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {declaration.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {declaration.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {declaration.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatAmount(declaration.amount)} F CFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {declaration.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeclarationStatusColor(declaration.status)}`}>
                            {declaration.status === 'paid' ? 'Payé' : 
                             declaration.status === 'pending' ? 'À payer' : 'En retard'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                              <Download className="w-4 h-4" />
                            </button>
                            {declaration.status === 'pending' && (
                              <button className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Échéances à venir</h5>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      N'oubliez pas de soumettre votre déclaration IRPP avant le 10/02/2024 et votre déclaration CNSS avant le 15/02/2024.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des employés</h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel employé
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/30">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Gestion des employés</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      La gestion complète des employés est disponible dans le module "Personnel & RH". Vous pouvez y accéder pour créer, modifier ou supprimer des employés.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Historique des opérations de paie</h3>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter l'historique
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Journal des opérations</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Traitement de paie mensuel</h5>
                        <span className="text-xs text-gray-500 dark:text-gray-400">25/01/2024 14:30</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Traitement de paie pour 65 employés pour la période de Janvier 2024. Montant total: 15.678.000 F CFA.
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Succès
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Génération des bulletins de paie</h5>
                        <span className="text-xs text-gray-500 dark:text-gray-400">25/01/2024 14:35</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Génération de 65 bulletins de paie pour la période de Janvier 2024.
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Succès
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Génération déclaration CNSS</h5>
                        <span className="text-xs text-gray-500 dark:text-gray-400">12/01/2024 10:15</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Génération de la déclaration CNSS pour la période de Décembre 2023. Montant: 3.072.000 F CFA.
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Succès
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analytics de paie</h3>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Répartition de la masse salariale
                  </h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Graphique de répartition par département</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            Enseignement
                          </span>
                          <span>65%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            Administration
                          </span>
                          <span>20%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            Services de soutien
                          </span>
                          <span>10%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            Maintenance
                          </span>
                          <span>5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Évolution de la masse salariale
                  </h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Graphique d'évolution sur 12 mois</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Janvier 2024</span>
                          <span className="font-bold text-green-600 dark:text-green-400">15.678.000 F CFA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Décembre 2023</span>
                          <span className="font-bold">15.350.000 F CFA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Novembre 2023</span>
                          <span className="font-bold">15.120.000 F CFA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Répartition par type</h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">69%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Personnel permanent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">31%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Personnel vacataire</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Charges sociales</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">CNSS</span>
                      <span className="font-bold">3.135.600 F CFA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">IRPP</span>
                      <span className="font-bold">1.208.000 F CFA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Formation Pro.</span>
                      <span className="font-bold">188.136 F CFA</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Coût employeur</h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">18.234.000 F CFA</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Coût total employeur</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">+2,1%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Évolution mensuelle</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        onSave={handleSavePayroll}
        employeeData={selectedPayroll}
        isEdit={isEditMode}
      />

      <PayrollBatchModal
        isOpen={isPayrollBatchModalOpen}
        onClose={() => setIsPayrollBatchModalOpen(false)}
        onSave={handleSaveBatch}
      />

      <PayrollReportModal
        isOpen={isPayrollReportModalOpen}
        onClose={() => setIsPayrollReportModalOpen(false)}
        onGenerate={handleGenerateReport}
      />

      <PayrollDeclarationModal
        isOpen={isPayrollDeclarationModalOpen}
        onClose={() => setIsPayrollDeclarationModalOpen(false)}
        onGenerate={handleGenerateDeclaration}
      />

      <PayrollSettingsModal
        isOpen={isPayrollSettingsModalOpen}
        onClose={() => setIsPayrollSettingsModalOpen(false)}
        onSave={handleSaveSettings}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeletePayroll}
        title="Supprimer cette fiche de paie ?"
        message={`Êtes-vous sûr de vouloir supprimer la fiche de paie de ${selectedPayroll?.employeeName} pour la période ${selectedPayroll?.period} ? Cette action est irréversible.`}
        type="danger"
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title="Opération réussie"
        message="L'opération a été effectuée avec succès."
        type="success"
      />
    </div>
  );
};

// Composant Info manquant
const Info: React.FC<{ className: string }> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
};

export default PayrollManagement;