// components/ContactForm.tsx
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import * as yup from 'yup';
import { ContactFormData, TagColors, TagLabels, TagType } from '../types';

const schema = yup.object().shape({
  name: yup.string().required('Tên là bắt buộc').max(255, 'Tên không quá 255 ký tự'),
  phone: yup.string().required('Số điện thoại là bắt buộc').matches(/^(\+84|0)[3-9]\d{8}$/, 'Số điện thoại không hợp lệ'),
  tag: yup.mixed<TagType>().oneOf(['FAMILY', 'FRIEND', 'COLLEAGUE', 'OTHER']).required('Tag là bắt buộc'),
});

interface ContactFormProps {
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => void;
  submitText: string;
}

export default function ContactForm({ initialData, onSubmit, submitText }: ContactFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const onFormSubmit = (data: ContactFormData) => {
    onSubmit(data);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Tên"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
            />
          )}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

        <Controller
          control={control}
          name="tag"
          render={({ field: { onChange, value } }) => (
            <View style={styles.tagContainer}>
              {(Object.keys(TagLabels) as TagType[]).map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    value === tag && styles.selectedTag,
                    { borderColor: TagColors[tag] }
                  ]}
                  onPress={() => onChange(tag)}
                >
                  <Text style={[
                    styles.tagText,
                    value === tag && styles.selectedTagText,
                    { color: value === tag ? 'white' : TagColors[tag] }
                  ]}>
                    {TagLabels[tag]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.tag && <Text style={styles.error}>{errors.tag.message}</Text>}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onFormSubmit)}>
          <Text style={styles.submitText}>{submitText}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  selectedTag: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTagText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
