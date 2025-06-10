import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AuthContext } from '@/context/AuthContext';
import { ListingContext } from '@/context/ListingContext';
import { mockUsers } from '@/mock/data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Check, X, Info, ShieldAlert } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { listings } = useContext(ListingContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ title: '', description: '' });
  
  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, user, navigate, toast]);

  const handleAction = (action: string, type: string, id: string) => {
    setDialogMessage({
      title: `${action} ${type}`,
      description: `This action would ${action.toLowerCase()} the ${type.toLowerCase()} with ID: ${id}. This is a simulated action in the demo.`,
    });
    setOpenDialog(true);
  };

  // Mock subscription stats
  const subscriptionStats = {
    activeSubscriptions: 3,
    revenue: 3100,
    mostPopularPlan: '3 months',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">
          <ShieldAlert className="h-3.5 w-3.5 mr-1" />
          Admin Access
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-muted-foreground text-sm mb-1">Total Users</div>
          <div className="text-2xl font-bold">{mockUsers.length}</div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-muted-foreground text-sm mb-1">Total Listings</div>
          <div className="text-2xl font-bold">{listings.length}</div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-muted-foreground text-sm mb-1">Revenue</div>
          <div className="text-2xl font-bold">{formatCurrency(subscriptionStats.revenue)}</div>
        </div>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.filter(u => !u.isAdmin).map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={user.isVerified} 
                        onCheckedChange={() => handleAction(user.isVerified ? 'Unverify' : 'Verify', 'User', user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction('Suspend', 'User', user.id)}
                      >
                        Suspend
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="listings" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Approve</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map(listing => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.title}</TableCell>
                    <TableCell>{listing.category}</TableCell>
                    <TableCell>{formatCurrency(listing.price)}/{listing.unit}</TableCell>
                    <TableCell>{formatDate(listing.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-success"
                          onClick={() => handleAction('Approve', 'Listing', listing.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleAction('Reject', 'Listing', listing.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction('Remove', 'Listing', listing.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="subscriptions" className="mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="text-muted-foreground text-sm mb-1">Active Subscriptions</div>
                <div className="text-2xl font-bold">{subscriptionStats.activeSubscriptions}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="text-muted-foreground text-sm mb-1">Total Revenue</div>
                <div className="text-2xl font-bold">{formatCurrency(subscriptionStats.revenue)}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="text-muted-foreground text-sm mb-1">Most Popular Plan</div>
                <div className="text-2xl font-bold">{subscriptionStats.mostPopularPlan}</div>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers
                    .filter(u => u.subscriptionEnd && !u.isAdmin)
                    .map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.subscriptionPlan}</TableCell>
                        <TableCell>01 Jun 2025</TableCell>
                        <TableCell>{user.subscriptionEnd ? formatDate(user.subscriptionEnd) : '-'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAction('Extend', 'Subscription', user.id)}
                          >
                            Extend
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogMessage.title}</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-start gap-2 mb-2">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <p>{dialogMessage.description}</p>
              </div>
              <p className="text-muted-foreground italic text-sm">
                Note: This is a demo application. No actual changes will be made.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              toast({
                title: "Action simulated",
                description: "In a real application, this action would be performed.",
              });
              setOpenDialog(false);
            }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}