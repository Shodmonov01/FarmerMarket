import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { SubscriptionPlan as PlanType } from '@/types';

interface SubscriptionPlanProps {
  plan: {
    id: string;
    name: PlanType;
    price: number;
    description: string;
    features: string[];
  };
  isSelected: boolean;
  onSelect: () => void;
}

export default function SubscriptionPlan({ plan, isSelected, onSelect }: SubscriptionPlanProps) {
  const { user } = useContext(AuthContext);
  
  // Проверяем, является ли этот план текущим для пользователя
  const isCurrentPlan = user?.subscriptionPlan === plan.name;

  const cardVariants = {
    selected: {
      scale: 1.02,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      borderColor: 'var(--color-primary)',
    },
    notSelected: {
      scale: 1,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderColor: 'var(--color-border)',
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      animate={isSelected ? 'selected' : 'notSelected'}
      transition={{ duration: 0.3 }}
      className={`border rounded-lg p-5 cursor-pointer ${isSelected ? 'border-primary' : 'border-border'}`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>
        
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-6 w-6 text-primary"
          >
            <CheckCircle className="h-6 w-6" />
          </motion.div>
        )}
      </div>
      
      <div className="mb-5">
        <span className="text-2xl font-bold">{formatCurrency(plan.price)}</span>
      </div>
      
      <ul className="space-y-2 mb-5">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      {isCurrentPlan ? (
        <Button className="w-full" disabled>
          Текущий тариф
        </Button>
      ) : (
        <Button
          className="w-full"
          variant={isSelected ? 'default' : 'outline'}
        >
          {isSelected ? 'Выбран' : 'Выбрать тариф'}
        </Button>
      )}
    </motion.div>
  );
}