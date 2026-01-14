import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { CheckCircle2, ChevronRight, ChevronLeft, RotateCcw, Award } from 'lucide-react';
import { ASSESSMENT_QUESTIONS, Question } from '../data/questions';

export function AssessmentEngine() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep];
  const progress = ((currentStep) / ASSESSMENT_QUESTIONS.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    const total = Object.values(answers).reduce((a, b) => a + b, 0);
    const max = ASSESSMENT_QUESTIONS.length * 5;
    return Math.round((total / max) * 100);
  };

  const getTier = (score: number) => {
    if (score >= 80) return { name: 'Tier 1: AI Native', color: 'bg-emerald-500', text: 'Ready for complex autonomous agents.' };
    if (score >= 50) return { name: 'Tier 2: Adopter', color: 'bg-blue-500', text: 'Ready for assisted copilots and RAG.' };
    return { name: 'Tier 3: Explorer', color: 'bg-amber-500', text: 'Focus on data hygiene and governance first.' };
  };

  if (isComplete) {
    const score = calculateScore();
    const tier = getTier(score);

    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="text-center p-8 border-2 border-primary/20">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Assessment Complete</CardTitle>
            <CardDescription>Here is your organization's AI Readiness Score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl font-bold text-slate-900">{score}/100</div>
            
            <div className={`inline-block px-4 py-2 rounded-full text-white font-bold ${tier.color}`}>
              {tier.name}
            </div>
            
            <p className="text-slate-600 max-w-md mx-auto">
              {tier.text}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
              <div className="p-4 bg-slate-50 rounded border">
                <h4 className="font-bold text-slate-900 mb-2">Strengths</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Executive Sponsorship</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cloud Infrastructure</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 rounded border">
                <h4 className="font-bold text-slate-900 mb-2">Recommended Actions</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-amber-500" /> Establish Governance Board</li>
                  <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-amber-500" /> Clean Data Pipeline</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center gap-4">
             <Button variant="outline" onClick={() => { setIsComplete(false); setCurrentStep(0); setAnswers({}); }}>
               <RotateCcw className="w-4 h-4 mr-2" />
               Retake
             </Button>
             <Button>
               Download Full Report
             </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-sm font-medium text-slate-500">
          <span>Question {currentStep + 1} of {ASSESSMENT_QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <Badge variant="outline" className="w-fit mb-2">{currentQuestion.category}</Badge>
          <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className={`
                p-4 border rounded-lg cursor-pointer transition-all flex items-center justify-between
                ${answers[currentQuestion.id] === opt.value 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'hover:bg-slate-50 border-slate-200'}
              `}
            >
              <span className="text-sm font-medium text-slate-700">{opt.label}</span>
              {answers[currentQuestion.id] === opt.value && (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
          >
            {currentStep === ASSESSMENT_QUESTIONS.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
