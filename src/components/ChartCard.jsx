import {Card} from '@/component/ui/card';

const ChartCard = ({ title, children }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="h-[300px]">{children}</div>
    </Card>
  );
};

export default ChartCard;