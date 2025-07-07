import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { JournalEntry, JournalTemplate } from '../types/journal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Fonction pour nettoyer le HTML et extraire le texte
const stripHtml = (html: string): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Fonction pour générer un PDF à partir d'une entrée de journal
export const generateEntryPDF = (entry: JournalEntry): void => {
  const doc = new jsPDF();
  
  // Titre du document
  doc.setFontSize(22);
  doc.text('Cahier Journal - Séance', 105, 20, { align: 'center' });
  
  // Informations de base
  doc.setFontSize(14);
  doc.text(`${entry.title}`, 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Matière: ${entry.subject}`, 20, 45);
  doc.text(`Classe: ${entry.class}`, 20, 52);
  doc.text(`Date: ${entry.date ? format(new Date(entry.date), 'dd MMMM yyyy', { locale: fr }) : 'Non planifiée'}`, 20, 59);
  doc.text(`Durée: ${entry.duration} minutes`, 20, 66);
  doc.text(`Statut: ${
    entry.status === 'planned' ? 'Planifiée' :
    entry.status === 'in_progress' ? 'En cours' :
    entry.status === 'completed' ? 'Terminée' :
    entry.status === 'postponed' ? 'Reportée' : 'Non défini'
  }`, 20, 73);
  
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(20, 80, 190, 80);
  
  // Objectifs
  doc.setFontSize(14);
  doc.text('Objectifs', 20, 90);
  doc.setFontSize(12);
  
  // Formater les objectifs
  let objectivesText = '';
  if (entry.objectives && entry.objectives.length > 0) {
    objectivesText = entry.objectives.map(obj => 
      `- ${obj.title}${obj.description ? ': ' + stripHtml(obj.description) : ''}`
    ).join('\n');
  } else {
    objectivesText = 'Aucun objectif défini';
  }
  
  const objectivesLines = doc.splitTextToSize(objectivesText, 170);
  doc.text(objectivesLines, 20, 100);
  
  // Étapes
  const yPos = 100 + objectivesLines.length * 7;
  doc.setFontSize(14);
  doc.text('Étapes', 20, yPos);
  doc.setFontSize(12);
  
  // Formater les étapes
  let stepsText = '';
  if (entry.steps && entry.steps.length > 0) {
    stepsText = entry.steps.map(step => 
      `- ${step.title} (${step.duration} min)${step.description ? ': ' + stripHtml(step.description) : ''}`
    ).join('\n');
  } else {
    stepsText = 'Aucune étape définie';
  }
  
  const stepsLines = doc.splitTextToSize(stepsText, 170);
  doc.text(stepsLines, 20, yPos + 10);
  
  // Matériel
  const yPos2 = yPos + 10 + stepsLines.length * 7;
  if (yPos2 > 250) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Matériel', 20, 20);
    doc.setFontSize(12);
    const materialsText = stripHtml(entry.materials || '');
    const materialsLines = doc.splitTextToSize(materialsText, 170);
    doc.text(materialsLines, 20, 30);
    
    // Notes
    const yPos3 = 30 + materialsLines.length * 7;
    doc.setFontSize(14);
    doc.text('Notes', 20, yPos3);
    doc.setFontSize(12);
    const notesText = stripHtml(entry.notes || '');
    const notesLines = doc.splitTextToSize(notesText, 170);
    doc.text(notesLines, 20, yPos3 + 10);
  } else {
    doc.setFontSize(14);
    doc.text('Matériel', 20, yPos2);
    doc.setFontSize(12);
    const materialsText = stripHtml(entry.materials || '');
    const materialsLines = doc.splitTextToSize(materialsText, 170);
    doc.text(materialsLines, 20, yPos2 + 10);
    
    // Notes
    const yPos3 = yPos2 + 10 + materialsLines.length * 7;
    doc.setFontSize(14);
    doc.text('Notes', 20, yPos3);
    doc.setFontSize(12);
    const notesText = stripHtml(entry.notes || '');
    const notesLines = doc.splitTextToSize(notesText, 170);
    doc.text(notesLines, 20, yPos3 + 10);
  }
  
  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} / ${pageCount}`, 105, 285, { align: 'center' });
    doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, 105, 292, { align: 'center' });
  }
  
  // Enregistrement du PDF
  doc.save(`cahier-journal_${entry.title.replace(/\s+/g, '_')}.pdf`);
};

// Fonction pour générer un PDF à partir d'un modèle
export const generateTemplatePDF = (template: JournalTemplate): void => {
  const doc = new jsPDF();
  
  // Titre du document
  doc.setFontSize(22);
  doc.text('Modèle de Séance', 105, 20, { align: 'center' });
  
  // Informations de base
  doc.setFontSize(14);
  doc.text(`${template.title}`, 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Matière: ${template.subject}`, 20, 45);
  doc.text(`Niveau: ${template.level}`, 20, 52);
  doc.text(`Durée: ${template.duration} minutes`, 20, 59);
  
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(20, 66, 190, 66);
  
  // Objectifs
  doc.setFontSize(14);
  doc.text('Objectifs', 20, 76);
  doc.setFontSize(12);
  
  // Formater les objectifs
  let objectivesText = '';
  if (template.objectives && template.objectives.length > 0) {
    objectivesText = template.objectives.map(obj => 
      `- ${obj.title}${obj.description ? ': ' + stripHtml(obj.description) : ''}`
    ).join('\n');
  } else {
    objectivesText = 'Aucun objectif défini';
  }
  
  const objectivesLines = doc.splitTextToSize(objectivesText, 170);
  doc.text(objectivesLines, 20, 86);
  
  // Étapes
  const yPos = 86 + objectivesLines.length * 7;
  doc.setFontSize(14);
  doc.text('Étapes', 20, yPos);
  doc.setFontSize(12);
  
  // Formater les étapes
  let stepsText = '';
  if (template.steps && template.steps.length > 0) {
    stepsText = template.steps.map(step => 
      `- ${step.title} (${step.duration} min)${step.description ? ': ' + stripHtml(step.description) : ''}`
    ).join('\n');
  } else {
    stepsText = 'Aucune étape définie';
  }
  
  const stepsLines = doc.splitTextToSize(stepsText, 170);
  doc.text(stepsLines, 20, yPos + 10);
  
  // Matériel
  const yPos2 = yPos + 10 + stepsLines.length * 7;
  if (yPos2 > 250) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Matériel', 20, 20);
    doc.setFontSize(12);
    const materialsText = stripHtml(template.materials || '');
    const materialsLines = doc.splitTextToSize(materialsText, 170);
    doc.text(materialsLines, 20, 30);
    
    // Notes
    const yPos3 = 30 + materialsLines.length * 7;
    doc.setFontSize(14);
    doc.text('Notes', 20, yPos3);
    doc.setFontSize(12);
    const notesText = stripHtml(template.notes || '');
    const notesLines = doc.splitTextToSize(notesText, 170);
    doc.text(notesLines, 20, yPos3 + 10);
  } else {
    doc.setFontSize(14);
    doc.text('Matériel', 20, yPos2);
    doc.setFontSize(12);
    const materialsText = stripHtml(template.materials || '');
    const materialsLines = doc.splitTextToSize(materialsText, 170);
    doc.text(materialsLines, 20, yPos2 + 10);
    
    // Notes
    const yPos3 = yPos2 + 10 + materialsLines.length * 7;
    doc.setFontSize(14);
    doc.text('Notes', 20, yPos3);
    doc.setFontSize(12);
    const notesText = stripHtml(template.notes || '');
    const notesLines = doc.splitTextToSize(notesText, 170);
    doc.text(notesLines, 20, yPos3 + 10);
  }
  
  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} / ${pageCount}`, 105, 285, { align: 'center' });
    doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, 105, 292, { align: 'center' });
  }
  
  // Enregistrement du PDF
  doc.save(`modele_${template.title.replace(/\s+/g, '_')}.pdf`);
};

// Fonction pour générer un PDF avec la liste des séances
export const generateEntriesListPDF = (entries: JournalEntry[], period: string): void => {
  const doc = new jsPDF();
  
  // Titre du document
  doc.setFontSize(22);
  doc.text('Cahier Journal - Liste des Séances', 105, 20, { align: 'center' });
  
  // Période
  doc.setFontSize(14);
  doc.text(`Période: ${period}`, 105, 30, { align: 'center' });
  
  // Tableau des séances
  const tableColumn = ['Date', 'Matière', 'Classe', 'Titre', 'Durée', 'Statut'];
  const tableRows = entries.map(entry => [
    entry.date ? format(new Date(entry.date), 'dd/MM/yyyy', { locale: fr }) : 'Non planifiée',
    entry.subject,
    entry.class,
    entry.title,
    `${entry.duration} min`,
    entry.status === 'planned' ? 'Planifiée' :
    entry.status === 'in_progress' ? 'En cours' :
    entry.status === 'completed' ? 'Terminée' :
    entry.status === 'postponed' ? 'Reportée' : 'Non défini'
  ]);
  
  // @ts-ignore - jspdf-autotable n'est pas correctement typé
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 40 }
  });
  
  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} / ${pageCount}`, 105, 285, { align: 'center' });
    doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, 105, 292, { align: 'center' });
  }
  
  // Enregistrement du PDF
  doc.save(`cahier-journal_liste_${period.replace(/\s+/g, '_')}.pdf`);
};
