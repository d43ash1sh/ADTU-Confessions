import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Trash2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Semester {
  sgpa: number;
  credits: number;
}

export default function GradeCalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([{ sgpa: 0, credits: 0 }]);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);
  const { toast } = useToast();

  const addSemester = () => {
    setSemesters([...semesters, { sgpa: 0, credits: 0 }]);
  };

  const removeSemester = (index: number) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter((_, i) => i !== index));
    }
  };

  const updateSemester = (index: number, field: 'sgpa' | 'credits', value: number) => {
    const updated = [...semesters];
    updated[index][field] = value;
    setSemesters(updated);
  };

  const calculateCGPA = () => {
    const validSemesters = semesters.filter(s => s.sgpa > 0 && s.credits > 0);
    
    if (validSemesters.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid SGPA and credits for at least one semester.",
        variant: "destructive"
      });
      return;
    }

    const totalPoints = validSemesters.reduce((sum, sem) => sum + (sem.sgpa * sem.credits), 0);
    const totalCredits = validSemesters.reduce((sum, sem) => sum + sem.credits, 0);
    
    const calculatedCGPA = totalPoints / totalCredits;
    const calculatedPercentage = calculatedCGPA * 9.5; // Official ADTU formula
    
    setCgpa(Math.round(calculatedCGPA * 100) / 100);
    setPercentage(Math.round(calculatedPercentage * 100) / 100);
    
    toast({
      title: "Calculation Complete! 🎓",
      description: `Your CGPA is ${calculatedCGPA.toFixed(2)} - ${calculatedPercentage.toFixed(1)}%`,
    });
  };

  const reset = () => {
    setSemesters([{ sgpa: 0, credits: 0 }]);
    setCgpa(null);
    setPercentage(null);
  };

  const getGradeColor = (cgpa: number) => {
    if (cgpa >= 9.0) return "bg-green-100 text-green-800 border-green-300";
    if (cgpa >= 8.0) return "bg-blue-100 text-blue-800 border-blue-300";
    if (cgpa >= 7.0) return "bg-indigo-100 text-indigo-800 border-indigo-300";
    if (cgpa >= 6.0) return "bg-purple-100 text-purple-800 border-purple-300";
    if (cgpa >= 5.0) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (cgpa >= 4.0) return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getGradeText = (cgpa: number) => {
    if (cgpa >= 9.0) return "A+ Excellent! 🌟";
    if (cgpa >= 8.0) return "A Very Good! 👍";
    if (cgpa >= 7.0) return "B+ Good! 📚";
    if (cgpa >= 6.0) return "B Above Average! 🚀";
    if (cgpa >= 5.0) return "C Average 📝";
    if (cgpa >= 4.0) return "P Pass ✅";
    return "F Failed ❌";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-blue-500 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              ADTU Grade Calculator
            </h1>
            <BookOpen className="w-8 h-8 text-blue-500 ml-2" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Official ADTU 10-point grading system calculator
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-4 text-sm">
            <strong>Quick Reference:</strong> O(10), A+(9), A(8), B+(7), B(6), C(5), P(4), F(0)
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Semester Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {semesters.map((semester, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-500">Semester {index + 1}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <Label className="text-xs">SGPA</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          placeholder="8.5"
                          value={semester.sgpa || ''}
                          onChange={(e) => updateSemester(index, 'sgpa', parseFloat(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Credits</Label>
                        <Input
                          type="number"
                          min="0"
                          placeholder="24"
                          value={semester.credits || ''}
                          onChange={(e) => updateSemester(index, 'credits', parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {semesters.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeSemester(index)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
              
              <div className="flex space-x-2">
                <Button onClick={addSemester} variant="outline" className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Semester
                </Button>
                <Button onClick={calculateCGPA} className="flex-1 bg-blue-500 hover:bg-blue-600">
                  Calculate
                </Button>
              </div>
              
              <Button onClick={reset} variant="ghost" className="w-full text-gray-500">
                Reset All
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Your Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cgpa !== null ? (
                <div className="space-y-6">
                  {/* CGPA Display */}
                  <div className="text-center">
                    <div className={`inline-flex items-center px-6 py-4 rounded-xl border-2 ${getGradeColor(cgpa)}`}>
                      <div>
                        <div className="text-3xl font-bold">{cgpa}</div>
                        <div className="text-sm font-medium">CGPA</div>
                      </div>
                    </div>
                    <p className="mt-2 text-lg font-medium">{getGradeText(cgpa)}</p>
                    
                    {/* Funny ADTU Comment */}
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        {(() => {
                          if (cgpa >= 9.0) return "Bhai tu toh ADTU ka topper hai! Faculty tumhe example ke liye use karte honge 🏆😎";
                          if (cgpa >= 8.0) return "Solid performance bro! ADTU mein 8+ CGPA matlab tu serious student hai 📚✨";
                          if (cgpa >= 7.0) return "Decent hai yaar! ADTU standards ke hisaab se tu safe zone mein hai 👍😊";
                          if (cgpa >= 6.0) return "Chal theek hai, ADTU mein survive kar raha hai... placement ke time kaam aayega 🤞📈";
                          if (cgpa >= 5.0) return "Bhai thoda aur mehnat kar... ADTU ka average student ban ja kam se kam 😅💪";
                          if (cgpa >= 4.0) return "ADTU ka backlog system samajhna hi alag struggle hai bro... ek baar exam do, pass na ho toh tension mat lo, ADTU tumhe dobara moka zaroor dega – matlab wahi paper repeat karke tumhari zindagi rewind pe daal dega 💀😂";
                          return "Bro... ADTU mein F grade? Time to switch from gaming to studying mode 🎮➡️📚";
                        })()
                        }
                      </p>
                    </div>
                  </div>

                  {/* Percentage */}
                  {percentage !== null && percentage > 0 && (
                    <div className="text-center">
                      <Badge variant="outline" className="px-4 py-2 text-lg">
                        {percentage}% Equivalent
                      </Badge>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Summary:</h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div>Total Semesters: {semesters.filter(s => s.sgpa > 0).length}</div>
                      <div>Total Credits: {semesters.reduce((sum, s) => sum + (s.credits || 0), 0)}</div>
                      <div>Average SGPA: {cgpa}</div>
                    </div>
                  </div>

                  {/* Official ADTU Grade Scale */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="font-semibold">Official ADTU Grading Scale:</div>
                    <div>O (10) = Outstanding | A+ (9) = Excellent</div>
                    <div>A (8) = Very Good | B+ (7) = Good</div>
                    <div>B (6) = Above Average | C (5) = Average</div>
                    <div>P (4) = Pass | F (0) = Failed</div>
                    <div className="mt-2 font-semibold">Formula: Percentage = CGPA × 9.5</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Enter your semester details and click Calculate to see your CGPA</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}