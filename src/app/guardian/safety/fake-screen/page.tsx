
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Divide, Plus, Minus, Equal, Percent, PlusMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function FakeScreenPage() {
    const [display, setDisplay] = React.useState('0');
    const [isSosSubtlyActive, setIsSosSubtlyActive] = React.useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        // Subtle SOS activation trigger
        const timer = setTimeout(() => {
            setIsSosSubtlyActive(true);
            toast({
                title: "Silent SOS Active",
                description: "The fake screen is on. Silent alerts are being sent in the background.",
                variant: 'destructive'
            });
        }, 3000); // Activate after 3 seconds

        return () => clearTimeout(timer);
    }, [toast]);

    const handleButtonClick = (value: string) => {
        if (display === '0' && value !== '.') {
            setDisplay(value);
        } else {
            setDisplay(prev => prev + value);
        }
    };
    
    const handleClear = () => setDisplay('0');
    
    const handleOperation = () => {
        toast({
            title: "Calculator is for display only",
            description: "This is a fake screen to protect you. SOS alerts are running in the background."
        });
    };

    const CalculatorButton = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
        <Button 
            className={cn("h-20 w-20 rounded-full text-3xl font-light", className)}
            variant="ghost"
            onClick={onClick}
        >
            {children}
        </Button>
    )

  return (
    <div className="flex flex-col h-screen bg-black text-white items-center justify-end p-8">
        
        <div className="w-full max-w-sm flex-1 flex flex-col justify-end">
            {isSosSubtlyActive && (
                 <div className="absolute top-4 left-4 right-4">
                    <Alert variant="destructive" className="bg-red-900/50 border-red-500/30 text-white animate-pulse">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <AlertTitle className="font-bold text-red-300">SILENT SOS ACTIVE</AlertTitle>
                      <AlertDescription>
                        Broadcasting location to trusted contacts.
                      </AlertDescription>
                    </Alert>
                </div>
            )}
            {/* Display */}
            <div className="text-right mb-8">
                <p className="text-8xl font-thin tracking-tighter break-all">{display}</p>
            </div>
            
            {/* Buttons */}
            <div className="grid grid-cols-4 gap-4">
                 <CalculatorButton className="bg-gray-400 text-black hover:bg-gray-300" onClick={handleClear}>C</CalculatorButton>
                 <CalculatorButton className="bg-gray-400 text-black hover:bg-gray-300" onClick={handleOperation}><PlusMinus size={28}/></CalculatorButton>
                 <CalculatorButton className="bg-gray-400 text-black hover:bg-gray-300" onClick={handleOperation}><Percent size={28}/></CalculatorButton>
                 <CalculatorButton className="bg-orange-500 hover:bg-orange-400" onClick={handleOperation}><Divide size={32}/></CalculatorButton>

                 <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('7')}>7</CalculatorButton>
                 <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('8')}>8</CalculatorButton>
                 <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('9')}>9</CalculatorButton>
                 <CalculatorButton className="bg-orange-500 hover:bg-orange-400" onClick={handleOperation}><X size={32}/></CalculatorButton>
                 
                 <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('4')}>4</CalculatorButton>
                 <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('5')}>5</CalculatorButton>
                 <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('6')}>6</CalculatorButton>
                 <CalculatorButton className="bg-orange-500 hover:bg-orange-400" onClick={handleOperation}><Minus size={32}/></CalculatorButton>

                 <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('1')}>1</CalculatorButton>
                 <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('2')}>2</CalculatorButton>
                 <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('3')}>3</CalculatorButton>
                 <CalculatorButton className="bg-orange-500 hover:bg-orange-400" onClick={handleOperation}><Plus size={32}/></CalculatorButton>

                <CalculatorButton className="col-span-2 w-full justify-start pl-8 bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('0')}>0</CalculatorButton>
                <CalculatorButton className="bg-gray-700 hover:bg-gray-600" onClick={() => handleButtonClick('.')}>.</CalculatorButton>
                <CalculatorButton className="bg-orange-500 hover:bg-orange-400" onClick={handleOperation}><Equal size={32}/></CalculatorButton>
            </div>
        </div>
    </div>
  );
}
