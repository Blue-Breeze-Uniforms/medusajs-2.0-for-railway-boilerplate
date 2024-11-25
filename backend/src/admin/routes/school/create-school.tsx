import {
  FocusModal,
  Heading,
  Label,
  Input,
  Button,
  Select,
  Checkbox,
  Textarea,
} from "@medusajs/ui";
import { useForm, FormProvider, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { faker } from "@faker-js/faker";
import { generateIndianPhoneNumber } from "../../helpers/utils";
import { useMutation } from "@tanstack/react-query";
import { sdk } from "@/admin/lib/config.js";
import { DetailWidgetProps, type HttpTypes } from "@medusajs/framework/types";
import { Toaster, toast } from "@medusajs/ui";

const phoneRegex = /^(?:(?:\+91|91|0)[-\s]?)?[6-9]\d{9}$/;

const schoolSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters"),
  shortName: z.string().max(10, "Short name must not exceed 10 characters"),
  type: z.enum(["primary", "secondary", "university", "vocational"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters long")
    .max(200, "Address must not exceed 200 characters")
    .nullable(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters long")
    .max(50, "City must not exceed 50 characters"),
  state: z
    .string()
    .min(2, "State must be at least 2 characters long")
    .max(50, "State must not exceed 50 characters"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters long")
    .max(50, "Country must not exceed 50 characters"),
  postalCode: z
    .string()
    .min(3, "Postal code must be at least 3 characters long")
    .max(20, "Postal code must not exceed 20 characters"),
  website: z.string().url("Invalid URL format").nullable(),
  studentCount: z
    .number()
    .int()
    .nonnegative("Student count must be non-negative"),
  principalName: z
    .string()
    .min(2, "Principal name must be at least 2 characters long")
    .max(100, "Principal name must not exceed 100 characters")
    .nullable(),
  contactPersonName: z
    .string()
    .min(2, "Contact person name must be at least 2 characters long")
    .max(100, "Contact person name must not exceed 100 characters")
    .nullable(),
  contactPersonEmail: z.string().email("Invalid email format").nullable(),
  contactPersonPhone: z.string().nullable(),
  isActive: z.boolean(),
  logo: z.string().url("Invalid URL format").nullable(),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

const defaultValues: SchoolFormValues = {
  name: faker.company.name(),
  shortName: faker.company.name().slice(0, 10),
  type: faker.helpers.arrayElement([
    "primary",
    "secondary",
    "university",
    "vocational",
  ]),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state(),
  country: faker.location.country(),
  postalCode: faker.location.zipCode(),
  website: faker.internet.url(),
  studentCount: faker.number.int({ min: 50, max: 5000 }),
  principalName: faker.name.fullName(),
  contactPersonName: faker.name.fullName(),
  contactPersonEmail: faker.internet.email(),
  contactPersonPhone: generateIndianPhoneNumber(),
  isActive: faker.datatype.boolean(),
  logo: faker.image.url(),
};
type CreateSchoolFormProps = {
  onSuccess?: () => void;
};

export const CreateSchoolForm = ({ onSuccess }: CreateSchoolFormProps) => {
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues,
  });



  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (payload: any) => sdk.insertSchool(payload),
    onSuccess: () => {
      toast("School created successfully");
      form.reset(defaultValues);
      onSuccess?.();
    },
    onError: () => {
      toast("Failed to create school");
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data);
  });

  return (
    <>
   
      <FocusModal>
        <FocusModal.Trigger asChild>
          <Button>Create School</Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col overflow-hidden"
            >
              <FocusModal.Header>
                <div className="flex items-center justify-end gap-x-2">
                  <FocusModal.Close asChild>
                    <Button size="small" variant="secondary">
                      Cancel
                    </Button>
                  </FocusModal.Close>
                  <Button type="submit" size="small">
                    Save
                  </Button>
                </div>
              </FocusModal.Header>
              <FocusModal.Body>
                <div className="flex flex-1 flex-col items-center overflow-y-auto">
                  <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                    <div>
                      <Heading className="capitalize">Create School</Heading>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(defaultValues).map((key) => (
                        <Controller
                          key={key}
                          control={form.control}
                          name={key as keyof SchoolFormValues}
                          render={({ field, fieldState: { error } }) => {
                            const commonProps = {
                              ...field,
                              placeholder:
                                key.charAt(0).toUpperCase() +
                                key
                                  .slice(1)
                                  .replace(/([A-Z])/g, " $1")
                                  .trim(),
                            };

                            return (
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-x-1">
                                  <Label size="small" weight="plus">
                                    {commonProps.placeholder}
                                  </Label>
                                </div>
                                {key === "type" ? (
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <Select.Trigger>
                                      <Select.Value placeholder="Select school type" />
                                    </Select.Trigger>
                                    <Select.Content>
                                      {[
                                        "primary",
                                        "secondary",
                                        "university",
                                        "vocational",
                                      ].map((type) => (
                                        <Select.Item key={type} value={type}>
                                          {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select>
                                ) : key === "isActive" ? (
                                  <Checkbox
                                    checked={field.value as boolean}
                                    onCheckedChange={field.onChange}
                                  />
                                ) : key === "address" ? (
                                  <Textarea {...commonProps} />
                                ) : (
                                  <Input
                                    {...commonProps}
                                    type={
                                      key === "studentCount" ? "number" : "text"
                                    }
                                  />
                                )}
                                {error && (
                                  <p className="text-ui-fg-error text-xs">
                                    {error.message}
                                  </p>
                                )}
                              </div>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </FocusModal.Body>
            </form>
          </FormProvider>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};
