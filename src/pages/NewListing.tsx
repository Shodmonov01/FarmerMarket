import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AuthContext } from '@/context/AuthContext'
import { ListingContext } from '@/context/ListingContext'
import { getDaysRemaining } from '@/lib/utils'
import { Image, X, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createProduct } from '@/api/productsByOwners'
import { Category } from '@/types'
import { getCategories } from '@/api/products'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const units = [
    { value: 'kg', label: 'кг' },
    { value: 'liter', label: 'литр' },
    { value: 'piece', label: 'штука' }
]

const formSchema = z.object({
    name: z.string().min(5, 'Название должно содержать не менее 5 символов'),
    description: z.string().min(20, 'Описание должно содержать не менее 20 символов'),
    price: z.coerce.number().positive('Цена должна быть положительной'),
    unit_type: z.enum(['kg', 'liter', 'piece']),
    pcs: z.coerce.number().int().nonnegative('Количество должно быть целым числом'),
    category: z.string().min(1, 'Выберите категорию')
})

type FormValues = z.infer<typeof formSchema>

export default function NewListingPage() {
    const { user, isAuthenticated } = useContext(AuthContext)
    const { addListing } = useContext(ListingContext)
    const { toast } = useToast()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    // Load categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategories()
                setCategories(fetchedCategories)
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        if (!isAuthenticated) {
            toast({
                title: 'Требуется вход',
                description: 'Для создания объявления необходимо войти в систему.',
                variant: 'destructive'
            })
            navigate('/register')
            return
        }

        // Новая логика проверки подписки
        if (user) {
            const canCreateListing = checkSubscription(user)
            if (!canCreateListing) {
                toast({
                    title: 'Требуется подписка',
                    description: 'Для создания объявлений необходима активная подписка.',
                    variant: 'destructive'
                })
                navigate('/subscribe')
            }
        }
    }, [isAuthenticated, user, navigate, toast])

    // Функция проверки подписки
    const checkSubscription = (user: User): boolean => {
        // Если у пользователя нет тарифа - нельзя создавать объявления
        if (!user.tariff) return false

        // Если есть subscriptionEnd, проверяем его
        if (user.subscriptionEnd) {
            return getDaysRemaining(user.subscriptionEnd) > 0
        }

        // Если нет subscriptionEnd, но есть тариф - считаем, что подписка активна
        return true
    }

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            unit_type: 'kg',
            pcs: 0,
            category: ''
        }
    })

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        if (imageFiles.length + files.length > 5) {
            toast({
                title: 'Слишком много изображений',
                description: 'Можно загрузить не более 5 изображений для одного объявления.',
                variant: 'destructive'
            })
            return
        }

        const newFiles = Array.from(files)
        const validFiles: File[] = []
        const newPreviews: string[] = []

        newFiles.forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                toast({
                    title: 'Файл слишком большой',
                    description: `Файл ${file.name} превышает ограничение в 5 МБ.`,
                    variant: 'destructive'
                })
                return
            }

            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast({
                    title: 'Недопустимый тип файла',
                    description: 'Допускаются только изображения в форматах JPEG, PNG и WebP.',
                    variant: 'destructive'
                })
                return
            }

            validFiles.push(file)
            const reader = new FileReader()
            reader.onload = e => {
                if (e.target?.result) {
                    newPreviews.push(e.target.result as string)
                    setImagePreviews(prev => [...prev, e.target.result as string])
                }
            }
            reader.readAsDataURL(file)
        })

        setImageFiles(prev => [...prev, ...validFiles])
        e.target.value = ''
    }

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const onSubmit = async (data: FormValues) => {
        if (imageFiles.length === 0) {
            toast({
                title: 'Требуются изображения',
                description: 'Пожалуйста, загрузите хотя бы одно изображение для вашего объявления.',
                variant: 'destructive'
            })
            return
        }

        if (!user) return

        setLoading(true)

        try {
            const productData = {
                name: data.name,
                description: data.description,
                unit_type: data.unit_type,
                pcs: data.pcs,
                price: data.price,
                images: imageFiles,
                category: data.category
            }

            await createProduct(productData)

            addListing({
                title: data.name,
                description: data.description,
                price: data.price,
                unit: data.unit_type,
                category: data.category,
                images: imagePreviews,
                sellerId: user.id,
                location: user.location
            })

            toast({
                title: 'Объявление создано',
                description: 'Ваше объявление успешно создано.'
            })

            navigate('/')
        } catch (error: any) {
            let errorMessage = 'Не удалось создать объявление. Попробуйте еще раз.'

            // Если это ошибка от сервера с JSON телом
            if (error.response && error.response.data) {
                const data = error.response.data

                // Проверка на non_field_errors
                if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
                    errorMessage = data.non_field_errors.join(', ')
                }

                // Можно добавить другие поля ошибок при необходимости
                // Например, если API возвращает error.message или error.detail
            }

            toast({
                title: 'Ошибка',
                description: errorMessage,
                variant: 'destructive'
            })
        }
    }

    return (
        <div className='max-w-md mx-auto py-4'>
            <h1 className='text-2xl font-bold mb-6'>Создать новое объявление</h1>

            <div className='mb-6'>
                <h2 className='font-semibold mb-2'>Загрузить фото</h2>
                <div className='grid grid-cols-3 gap-2'>
                    {imagePreviews.map((image, index) => (
                        <div key={index} className='relative aspect-square rounded-md overflow-hidden bg-secondary'>
                            <img src={image} alt={`Предпросмотр ${index}`} className='w-full h-full object-cover' />
                            <button
                                type='button'
                                className='absolute top-1 right-1 bg-destructive text-white rounded-full p-1'
                                onClick={() => removeImage(index)}
                            >
                                <X className='h-3 w-3' />
                            </button>
                        </div>
                    ))}

                    {imageFiles.length < 5 && (
                        <label className='aspect-square rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50'>
                            <Upload className='h-6 w-6 text-muted-foreground mb-1' />
                            <span className='text-xs text-muted-foreground'>Добавить фото</span>
                            <input
                                type='file'
                                accept='image/*'
                                multiple
                                className='hidden'
                                onChange={handleImageUpload}
                            />
                        </label>
                    )}
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                    Загрузите до 5 фотографий (макс. 5 МБ каждая, JPEG, PNG, WebP)
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Название</FormLabel>
                                <FormControl>
                                    <Input placeholder='например, Свежая органическая клубника' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Описание</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='Опишите ваш товар...' className='min-h-24' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='grid grid-cols-2 gap-4'>
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Цена</FormLabel>
                                    <FormControl>
                                        <Input type='number' min={0} step={0.01} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='unit_type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Единица измерения</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Выберите единицу измерения' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {units.map(unit => (
                                                <SelectItem key={unit.value} value={unit.value}>
                                                    {unit.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name='pcs'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Количество</FormLabel>
                                <FormControl>
                                    <Input type='number' min={0} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='category'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Категория</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Выберите категорию' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type='submit' className='w-full' disabled={loading}>
                        {loading ? 'Создание...' : 'Создать объявление'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
